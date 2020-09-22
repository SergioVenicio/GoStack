import handlerbars from 'handlebars';

import fs from 'fs';

import IParseMailTemplateDTO from '../dtos/IparseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class HandlebarsMailTemplate implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const fileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlerbars.compile(fileContent);
    return parseTemplate(variables);
  }
}
