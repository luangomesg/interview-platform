import React from "react";
import { FormControl, FormField as FormFieldUI, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file'
}

export default function FormField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = "text"
}: FormFieldProps<T>) {
    return (
        <FormFieldUI
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="label">{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            type={type}
                            {...field}
                            className="input"
                        />
                    </FormControl>
                    <FormMessage className="text-destructive text-[0.8rem] font-medium" />
                </FormItem>
            )}
        />
    );
}