import { FilterArgs } from "@/gql/graphql";

export interface IProps {
    defaultFilter?: FilterArgs;
    selectors?: SelectorType[];
}