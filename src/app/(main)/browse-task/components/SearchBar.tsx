import React from "react";
import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui";

export default function SearchBar({
    searchQuery,
    onSearch,
    onKeyPress,
    categories,
    category,
    onCategoryChange,
    locations,
    location,
    onLocationChange,
    sortBy,
    onSortByChange,
}: {
    searchQuery: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    categories: { id: string; name: string }[];
    category: string;
    onCategoryChange: (e: string) => void;
    locations: string[];
    location: string;
    onLocationChange: (e: string) => void;
    sortBy: string;
    onSortByChange: (e: string) => void;
}) {
    return (
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-6">
            <Input
                type="text"
                placeholder="Search for a job"
                value={searchQuery}
                onChange={onSearch}
                onKeyDown={onKeyPress}
                leftIcon={<Search className="h-5 w-5" />}
                className="min-w-[200px] flex-grow rounded-full bg-surface-muted"
            />

            <div className="flex shrink-0 flex-wrap justify-center gap-4">
                <Select
                    placeholder="Categories"
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                />
                <Select
                    placeholder="Location"
                    value={location}
                    onChange={(e) => onLocationChange(e.target.value)}
                    options={locations.map((loc) => ({ value: loc, label: loc }))}
                />
                <Select
                    placeholder="Sort By"
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value)}
                    options={[
                        { value: "newest", label: "Newest" },
                        { value: "price_low_high", label: "Price: Low to High" },
                        { value: "price_high_low", label: "Price: High to Low" },
                    ]}
                />
            </div>
        </div>
    );
}
