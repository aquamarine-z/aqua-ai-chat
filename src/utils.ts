'use client'
import {SetStateAction} from "react";

export function applySetStateAction<T>(prev: T, action: SetStateAction<T>): T {
    let value = prev
    if (typeof action === "function") {
        value = (action as ((prevState: T) => T))(prev)
    } else {
        value = action
    }
    return value
}

export function generateAvailableId(existingIds: Set<number>): number {
    let id = Math.floor(Math.random() * 1000000);
    while (existingIds.has(id)) {
        id = Math.floor(Math.random() * 1000000);
    }
    return id;
}