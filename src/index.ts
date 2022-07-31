import { Request, Response } from 'express';
import { buildArray, format, fromRequest, getInteger, getParameters, getStatusCode, handleError, jsonResult, Log, ViewController } from 'express-ext';
import { RateCommentFilter, RateCommentService, RateService } from './core';

interface ErrorMessage {
  field: string;
  code: string;
  param?: string|number|Date;
  message?: string;
}
export interface Validator<T> {
  validate(model: T, ctx?: any): Promise<ErrorMessage[]>;
}
export class RateController<R, F, C> {
  constructor(protected log: Log, protected rateService: RateService<R, F, C>, public validator: Validator<R>, public commentValidator: Validator<C>, dates: string[], numbers: string[], private generate: () => string, commentId?: string, userId?: string, author?: string, id?: string) {
    this.id = (id && id.length > 0 ? id : 'id');
    this.author = (author && author.length > 0 ? author : 'author');
    this.userId = (userId && userId.length > 0 ? userId : 'userId');
    this.commentId = (commentId && commentId.length > 0 ? commentId : 'commentId');
    this.load = this.load.bind(this);
    this.rate = this.rate.bind(this);
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.search = this.search.bind(this);
    this.getComment = this.getComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.dates = dates ? dates : ['time'];
    this.numbers = numbers ? numbers : ['rate', 'usefulCount', 'replyCount', 'count', 'score'];
  }
  protected dates: string[];
  protected numbers: string[];
  protected id: string;
  protected author: string;
  protected userId: string;
  protected commentId: string;

  search(req: Request, res: Response) {
    const s = fromRequest<R>(req, buildArray(undefined, 'fields'));
    const l = getParameters(s);
    const s2: any = format(s, this.dates, this.numbers);
    const id = req.params[this.id];
    const author = req.params[this.author];
    s2[this.id] = id;
    s2[this.author] = author;
    this.rateService.search(s2, l.limit, l.skipOrRefId, l.fields)
      .then(result => jsonResult(res, result, false, l.fields))
      .catch(err => handleError(err, res, this.log));
  }
  load(req: Request, res: Response) {
    const id = req.params[this.id];
    const author = req.params[this.author];
    this.rateService.getRate(id, author).then(rate => {
      if (rate) {
        return res.status(200).json(rate).end();
      } else {
        return res.status(401).json(null).end();
      }
    }).catch(err => handleError(err, res, this.log));
  }
  rate(req: Request, res: Response) {
    const rate: any = req.body;
    const id = req.params[this.id];
    const author = req.params[this.author];
    rate[this.id] = id;
    rate[this.author] = author;
    this.validator.validate(rate).then(errors => {
      if (errors && errors.length > 0) {
        res.status(getStatusCode(errors)).json(errors).end();
      } else {
        this.rateService.rate(rate).then(rs => {
          return res.status(200).json(rs).end();
        }).catch(err => handleError(err, res, this.log));
      }
    }).catch(err => handleError(err, res, this.log));
  }
  setUseful(req: Request, res: Response) {
    const id = req.params.id;
    const author = req.params.author;
    const userId = req.params.userId;
    this.rateService.setUseful(id, author, userId).then(rs => {
      return res.status(200).json(rs).end();
    }).catch(err => handleError(err, res, this.log));
  }
  removeUseful(req: Request, res: Response) {
    const id = req.params[this.id];
    const author = req.params[this.author];
    const userId = req.params[this.userId];
    this.rateService.removeUseful(id, author, userId).then(rs => {
      return res.status(200).json(rs).end();
    }).catch(err => handleError(err, res, this.log));
  }
  comment(req: Request, res: Response) {
    const id = req.params[this.id];
    const author = req.params[this.author];
    const userId = req.params[this.userId];
    const commentId = this.generate();
    const comment: any = req.body;
    comment[this.commentId] = commentId;
    comment[this.id] = id;
    comment[this.author] = author;
    comment[this.userId] = userId;
    this.commentValidator.validate(comment).then(errors => {
      if (errors && errors.length > 0) {
        res.status(getStatusCode(errors)).json(errors).end();
      } else {
        this.rateService.comment(comment).then(rep => {
          return res.status(200).json(rep).end();
        }).catch(err => handleError(err, res, this.log));
      }
    }).catch(err => handleError(err, res, this.log));
  }
  removeComment(req: Request, res: Response) {
    const commentId = req.params[this.commentId];
    const author = req.params[this.author];
    this.rateService.removeComment(commentId, author).then(reply => {
      return res.status(200).json(reply).end();
    }).catch(err => handleError(err, res, this.log));
  }
  getComment(req: Request, res: Response) {
    const commentId = req.params[this.commentId];
    this.rateService.getComment(commentId).then(comment => {
      if (comment) {
        return res.status(200).json(comment).end();
      } else {
        return res.status(401).json(null).end();
      }
    }).catch(err => handleError(err, res, this.log));
  }
  getComments(req: Request, res: Response) {
    const id = req.params[this.id];
    const author = req.params[this.author];
    const limit = getInteger(req, 'limit');
    this.rateService.getComments(id, author, limit).then(comments => {
      res.status(200).json(comments).end();
    }).catch(err => handleError(err, res, this.log));
  }
  updateComment(req: Request, res: Response) {
    const id = req.params[this.id];
    const author = req.params[this.author];
    const userId = req.params[this.userId];
    const commentId = req.params[this.commentId];
    const comment: any = req.body;
    comment[this.commentId] = commentId;
    comment[this.id] = id;
    comment[this.author] = author;
    comment[this.userId] = userId;
    this.commentValidator.validate(comment).then(errors => {
      if (errors && errors.length > 0) {
        res.status(getStatusCode(errors)).json(errors).end();
      } else {
        this.rateService.updateComment(comment).then(rep => {
          return res.status(200).json(rep).end();
        }).catch(err => handleError(err, res, this.log));
      }
    }).catch(err => handleError(err, res, this.log));
  }
}
// tslint:disable-next-line:max-classes-per-file
export class RateCommentController<C> extends ViewController<C, string, RateCommentFilter> {
  constructor(log: Log, protected rateCommentService: RateCommentService<C>) {
    super(log, rateCommentService);
  }
}
