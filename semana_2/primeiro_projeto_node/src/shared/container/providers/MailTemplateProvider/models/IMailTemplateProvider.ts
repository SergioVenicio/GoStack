import { de } from 'date-fns/locale';

import IParseMailTemplateDTO from '../dtos/IparseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(IParseMailTemplateDTO): Promise<string>;
}
