import { Suggestion } from "../schemas/Suggestion";
import { User } from "../schemas/User";

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
        //Testar variações desse algoritmo para ver resultados melhores (ou piores)

        result.push([suggestion.name, x + y]);
    })

    result.sort(([a, b], [c, d]) => d - b);
    //ordenar pelo maior indice de jaccard

    return result;
}
  
const sample = async (user) => {
    const suggestions = await User.aggregate([
        { $sample: { size: 20 } }, //mudar esse valor no futuro
        { $match: { name: { $ne: user.name } } } 
    ])

    return suggestions;
}

export const create = async (user) => {
    if (user) {
        const date = new Date();
        //essa consulta é muito complexa e o chatgpt deu um help
        const count = await Suggestion.countDocuments({ to: user.name, $expr: {
            $or: [
                { $lt: [{ $year: "$createdAt" }, date.getFullYear()] },
                { $and: [
                    { $eq: [{ $year: "$createdAt" }, date.getFullYear()] },
                    { $lt: [{ $month: "$createdAt" }, date.getMonth() +1] }
                ]},
                { $and: [
                    { $eq: [{ $year: "$createdAt" }, date.getFullYear() +1] },
                    { $eq: [{ $month: "$createdAt" }, date.getMonth()] },
                    { $lt: [{ $dayOfMonth: "$createdAt" }, date.getDate()] }
                ]}
            ]
        } });

        if (count !== 0) {
            console.log("deleting");
            await Suggestion.deleteMany({ to: user.name });

            const result = (await match(user)).slice(0, 10);
            const users = result.map(data => data[0]);
            await Suggestion.create({ to: user.name, users });
        }

        const suggestion = await Suggestion.findOne({ to: user.name });
        return suggestion;
    }
}