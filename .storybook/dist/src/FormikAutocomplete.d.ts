/// <reference types="react" />
import { FastFieldProps } from "formik";
import { IAutocompleteProps } from "./Autocomplete";
export interface IBaseProps {
    name: string;
    fastFieldProps?: FastFieldProps;
}
export declare type FormikAutocompleteProps = IBaseProps & IAutocompleteProps;
export declare function FormikAutocompleteField(props: FormikAutocompleteProps): JSX.Element;
export declare namespace FormikAutocompleteField {
    var displayName: string;
    var __docgenInfo: {
        "description": string;
        "displayName": string;
        "props": {};
    };
}
