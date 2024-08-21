"use client";
import { useState, useCallback } from "react";
import { ReactTags } from "react-tag-autocomplete";
import "../_styles/PlaceTagField.css";

const MAX_LENGTH = 5;

// tags must only include: "A-Z, [space], -, /" and must be between 3 - 20 characters long
function isValid(value) {
    return /^[a-z\s\-\/]{3,20}$/i.test(value);
}

export default function PlaceTagField({ placeTags, setFormTags, tagSuggestions }) {
    // selected is the list of currently selected tags in the filed
    const [selected, setSelected] = useState(placeTags);

    const onAdd = useCallback(
        (newTag) => {
            console.log(newTag);
            setSelected([...selected, newTag]); // set tags shown in the field
            setFormTags([...selected, newTag]); // set tags in the formData (from parent)
        },
        [selected, setFormTags]
    );

    const onDelete = useCallback(
        (tagIndex) => {
            setSelected(selected.filter((_, i) => i !== tagIndex));
            setFormTags(selected.filter((_, i) => i !== tagIndex)); // remove tags in the formData (from parent)
        },
        [selected, setFormTags]
    );

    const onValidate = useCallback((value) => isValid(value), []);

    return (
        <>
            <ReactTags
                labelText="Select countries"
                selected={selected}
                suggestions={tagSuggestions}
                isInvalid={selected.length > MAX_LENGTH}
                onAdd={onAdd}
                onDelete={onDelete}
                onValidate={onValidate}
                noOptionsText="No matching countries"
                allowNew
                collapseOnSelect
                deleteButtonText="delete"
            />
            {selected.length > MAX_LENGTH ? (
                <p id="error" style={{ color: "#fd5956" }}>
                    Each place can have a maximum of {MAX_LENGTH} tags.
                </p>
            ) : null}
        </>
    );
}
