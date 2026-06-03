import {useState, useEffect} from "react";
import {CategoryResponseType} from "src/app/constants/type";
import {getCategories} from "src/app/helpers/api/categories";


export function useQueryCategories() {
    const [categories, setCategories] = useState<CategoryResponseType[]>([]);

    const loadCategories = async () => {
        try {
            const categories = await getCategories();
            setCategories(categories);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return {categories, loadCategories};
}
