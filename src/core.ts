export type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
  | 'boolean' | 'number' | 'integer' | 'string' | 'text'
  | 'object' | 'array' | 'binary'
  | 'primitives' | 'booleans' | 'numbers' | 'integers' | 'strings' | 'dates' | 'datetimes' | 'times';
export type FormatType = 'currency' | 'percentage' | 'email' | 'url' | 'phone' | 'fax' | 'ipv4' | 'ipv6';
export type MatchType = 'equal' | 'prefix' | 'contain' | 'max' | 'min'; // contain: default for string, min: default for Date, number

export interface Attribute {
  name?: string;
  field?: string;
  column?: string;
  type?: DataType;
  format?: FormatType;
  required?: boolean;
  match?: MatchType;
  default?: string|number|Date|boolean;
  key?: boolean;
  unique?: boolean;
  enum?: string[] | number[];
  q?: boolean;
  noinsert?: boolean;
  noupdate?: boolean;
  nopatch?: boolean;
  version?: boolean;
  length?: number;
  min?: number;
  max?: number;
  gt?: number;
  lt?: number;
  precision?: number;
  scale?: number;
  exp?: RegExp | string;
  code?: string;
  noformat?: boolean;
  ignored?: boolean;
  jsonField?: string;
  link?: string;
  typeof?: Attributes;
  true?: string|number;
  false?: string|number;
}
export interface Attributes {
  [key: string]: Attribute;
}
export interface Filter {
  page?: number;
  limit?: number;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;

  q?: string;
  keyword?: string;
  excluding?: string[]|number[];
  refId?: string|number;

  pageIndex?: number;
  pageSize?: number;
}
export interface Rate {
  id: string;
  author: string;
  authorURL?: string;
  rate: number;
  time: Date;
  review: string;
  usefulCount: number;
  replyCount: number;
  histories?: ShortRate[];
}
export interface ShortRate {
  rate: number;
  time: Date;
  review: string;
}
export interface RateFilter extends Filter {
  id?: string;
  author?: string;
  rate: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
}
export interface RateComment {
  commentId: string;
  id: string;
  author: string;
  userId: string;
  comment: string;
  time: Date;
  updatedAt?: Date;
  histories?: ShortComment[];
}
export interface ShortComment {
  comment: string;
  time: Date;
}
export interface RateCommentFilter extends Filter {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  comment?: string;
  time?: Date;
  updatedAt?: Date;
}
export interface SearchResult<T> {
  list: T[];
  total?: number;
  nextPageToken?: string;
  last?: boolean;
}
export interface ViewService<T, ID> {
  metadata?(): Attributes|undefined;
  load(id: ID, ctx?: any): Promise<T|null>;
}
export interface Query<T, ID, S> extends ViewService<T, ID> {
  search: (s: S, limit?: number, skip?: number|string, fields?: string[]) => Promise<SearchResult<T>>;
  metadata?(): Attributes|undefined;
  load(id: ID, ctx?: any): Promise<T|null>;
}
export interface RateCommentService extends Query<RateComment, string, RateCommentFilter> {
}
export interface RateService {
  search(s: RateFilter, limit?: number, offset?: number | string, fields?: string[], ctx?: any): Promise<SearchResult<Rate>>;
  getRate(id: string, author: string): Promise<Rate | null>;
  rate(rate: Rate): Promise<number>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  comment(comment: RateComment): Promise<number>;
  removeComment(id: string, author: string, ctx?: any): Promise<number>;
  updateComment(comment: RateComment): Promise<number>;
}
