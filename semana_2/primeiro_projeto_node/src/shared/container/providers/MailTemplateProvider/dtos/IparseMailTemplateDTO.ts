interface IVariables {
  [field: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: IVariables;
}
