"use client";

import SearchBar from "src/app/(main)/browse-task/components/SearchBar";
import JobListing from "src/app/(main)/browse-task/components/JobListing";
import JobCard from "@/components/domain/JobCard";

import React, {useState} from "react";
import useQueryTasks from "src/app/hooks/useQueryTasks";
import {TasksResponseType} from "src/app/constants/type";
import {useQueryCategories} from "src/app/hooks/useQueryCategories";

export default function Browser() {
    const [searchQuery, setSearchQuery] = useState("");
    const [resultsVisible, setResultsVisible] = useState(false);
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);

    const [keywords, setKeywords] = useState(null);
    const [categoryId, setCategoryId] = useState<string>(null);
    const [category, setCategory] = useState(null);
    const [location, setLocation] = useState(null);
    const [sortBy, setSortBy] = useState(null);

    const {tasks, allTasks} = useQueryTasks({
        keywords,
        categoryId,
        location,
    });
    const {categories} = useQueryCategories();
    const categoryNames = categories.map(category => category.name);
    const locations = [...new Set(allTasks?.map((task) => task.location).filter(Boolean))];

    const handleCategoryChange = (selectedCategory: string) => {
        // setCategory(selectedCategory);
        // const categoryId = categories.find(cat => cat.name === selectedCategory)?.id;
        setCategoryId(selectedCategory);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setResultsVisible(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            setResultsVisible(true);
        }
    };

    const handleSelectTask = (index: number) => {
        setSelectedTaskIndex(index);
    };

    const filteredTasks: TasksResponseType[] = tasks
        ?.filter((task) => {
            if (searchQuery && resultsVisible) {
                const lowerQuery = searchQuery.toLowerCase();
                return (
                    task.title.toLowerCase().includes(lowerQuery) ||
                    task.location.toLowerCase().includes(lowerQuery)
                );
            }
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "price_low_high") return a.budget - b.budget;
            if (sortBy === "price_high_low") return b.budget - a.budget;
            if (sortBy === "newest") return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            return 0;
        });

    if (tasks == null) return <h1 className="py-20 text-center text-xl font-semibold">Loading...</h1>;

    return (
        <section className="py-10">
            <SearchBar
                searchQuery={searchQuery}
                onSearch={handleSearch}
                onKeyPress={handleKeyPress}
                categories={categories}
                category={categoryId ?? ""}
                onCategoryChange={handleCategoryChange}
                locations={locations}
                location={location ?? ""}
                onLocationChange={setLocation}
                sortBy={sortBy ?? ""}
                onSortByChange={setSortBy}
            />

            {filteredTasks.length != 0 ? (
                <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
                    <div className="max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto pr-1">
                        {filteredTasks.map((task, idx) => (
                            <JobCard
                                key={idx}
                                title={task.title}
                                location={task.location}
                                date={task.dueDate}
                                budget={task.budget}
                                action={{ label: "View more", onClick: () => handleSelectTask(idx) }}
                            />
                        ))}
                    </div>
                    <div className="sticky top-24 hidden self-start md:block">
                        <JobListing task={filteredTasks[selectedTaskIndex] || filteredTasks[0]} />
                    </div>
                </div>
            ) : (
                <h1 className="pt-16 text-center text-xl font-bold text-text">No jobs found.</h1>
            )}
        </section>
    );
}
