import {Input} from "@/components/ui/input";
import React, {useState} from "react";

export default function SearchInput() {
    const [search, setSearch] = useState('');
    return (
        <Input onChange={e => setSearch(e.target.value)} value={search} placeholder="Ara" />
    )
}