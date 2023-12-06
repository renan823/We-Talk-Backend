import { Suggestion } from "../schemas/Suggestion";
import { User } from "../schemas/User";
import moment from "moment";

const jaccard = (list1, list2) => {
    const intersection = new Set([...list1].filter(x => list2.includes(x))).size;
    const union = list1.length + list2.length - intersection;

    return intersection / union;
}

const match = async (user) => {
    const suggestions = await sample(user);

    const result = [];
   
    suggestions.forEach(suggestion => {
        const x = jaccard(user.learn, suggestion.learn);
        const y = jaccard(user.speak, suggestion.speak);

        result.push([suggestion.name, x + y]);
    })

    result.sort(([a, b], [c, d]) => d - b);

    return result;
}
  
const sample = async (user) => {
    const suggestions = await User.aggregate([
        { $sample: { size: 20 } }, 
        { $match: { name: { $ne: user.name } } } 
    ])

    return suggestions;
}

export const create = async (user) => {
    if (user) {
        let suggestion = [];
        const date = moment().startOf("day");
        
        const count = await Suggestion.countDocuments({ to: user.name, createdAt: { $lt: date.toDate() }});

        if (count !== 0) {
            await Suggestion.deleteMany({ to: user.name });
        }

        const result = (await match(user)).slice(0, 10);
        const users = result.map(data => data[0]);
        await Suggestion.create({ to: user.name, users, createdAt: moment().startOf("day").toDate() });

        suggestion = await Suggestion.findOne({ to: user.name });
        return suggestion;
    }
}