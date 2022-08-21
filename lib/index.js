"use strict";
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var express_ext_1 = require("express-ext");
var ReactionController = (function () {
  function ReactionController(log, reactionService, commentValidator, dates, numbers, generate, commentId, userId, author, id) {
    this.log = log;
    this.reactionService = reactionService;
    this.commentValidator = commentValidator;
    this.generate = generate;
    this.id = (id && id.length > 0 ? id : 'id');
    this.author = (author && author.length > 0 ? author : 'author');
    this.userId = (userId && userId.length > 0 ? userId : 'userId');
    this.commentId = (commentId && commentId.length > 0 ? commentId : 'commentId');
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.getComment = this.getComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.search = this.search.bind(this);
    this.load = this.load.bind(this);
    this.dates = dates ? dates : ['time'];
    this.numbers = numbers ? numbers : ['rate', 'usefulCount', 'replyCount', 'count', 'score'];
  }
  ReactionController.prototype.load = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var author = req.params[this.author];
    this.reactionService.load(id, author).then(function (obj) {
      if (obj) {
        return res.status(200).json(obj).end();
      }
      else {
        return res.status(401).json(null).end();
      }
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  ReactionController.prototype.search = function (req, res) {
    var _this = this;
    var s = express_ext_1.fromRequest(req, express_ext_1.buildArray(undefined, 'fields'));
    var l = express_ext_1.getParameters(s);
    var s2 = express_ext_1.format(s, this.dates, this.numbers);
    var id = req.params[this.id];
    var author = req.params[this.author];
    if (id && id.length > 0) {
      s2[this.id] = id;
    }
    if (author && author.length > 0) {
      s2[this.author] = author;
    }
    this.reactionService.search(s2, l.limit, l.skipOrRefId, l.fields)
      .then(function (result) { return express_ext_1.jsonResult(res, result, false, l.fields); })
      .catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  ReactionController.prototype.setUseful = function (req, res) {
    var _this = this;
    var id = req.params.id;
    var author = req.params.author;
    var userId = req.params.userId;
    this.reactionService.setUseful(id, author, userId).then(function (rs) {
      return res.status(200).json(rs).end();
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  ReactionController.prototype.removeUseful = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var author = req.params[this.author];
    var userId = req.params[this.userId];
    this.reactionService.removeUseful(id, author, userId).then(function (rs) {
      return res.status(200).json(rs).end();
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  ReactionController.prototype.comment = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var author = req.params[this.author];
    var userId = req.params[this.userId];
    var commentId = this.generate();
    var comment = req.body;
    comment[this.commentId] = commentId;
    comment[this.id] = id;
    comment[this.author] = author;
    comment[this.userId] = userId;
    this.commentValidator.validate(comment).then(function (errors) {
      if (errors && errors.length > 0) {
        res.status(express_ext_1.getStatusCode(errors)).json(errors).end();
      }
      else {
        _this.reactionService.comment(comment).then(function (rep) {
          return res.status(200).json(rep).end();
        }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
      }
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  ReactionController.prototype.removeComment = function (req, res) {
    var _this = this;
    var commentId = req.params[this.commentId];
    var author = req.params[this.author];
    this.reactionService.removeComment(commentId, author).then(function (reply) {
      return res.status(200).json(reply).end();
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  ReactionController.prototype.getComment = function (req, res) {
    var _this = this;
    var commentId = req.params[this.commentId];
    this.reactionService.getComment(commentId).then(function (comment) {
      if (comment) {
        return res.status(200).json(comment).end();
      }
      else {
        return res.status(401).json(null).end();
      }
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  ReactionController.prototype.getComments = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var author = req.params[this.author];
    var limit = express_ext_1.getInteger(req, 'limit');
    this.reactionService.getComments(id, author, limit).then(function (comments) {
      res.status(200).json(comments).end();
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  ReactionController.prototype.updateComment = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var author = req.params[this.author];
    var userId = req.params[this.userId];
    var commentId = req.params[this.commentId];
    var comment = req.body;
    comment[this.commentId] = commentId;
    comment[this.id] = id;
    comment[this.author] = author;
    comment[this.userId] = userId;
    this.commentValidator.validate(comment).then(function (errors) {
      if (errors && errors.length > 0) {
        res.status(express_ext_1.getStatusCode(errors)).json(errors).end();
      }
      else {
        _this.reactionService.updateComment(comment).then(function (rep) {
          return res.status(200).json(rep).end();
        }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
      }
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  return ReactionController;
}());
exports.ReactionController = ReactionController;
var RateController = (function () {
  function RateController(log, act, validate, author, id) {
    this.log = log;
    this.act = act;
    this.validate = validate;
    this.id = (id && id.length > 0 ? id : 'id');
    this.author = (author && author.length > 0 ? author : 'author');
    this.rate = this.rate.bind(this);
  }
  RateController.prototype.rate = function (req, res) {
    var _this = this;
    var rate = req.body;
    var id = req.params[this.id];
    var author = req.params[this.author];
    rate[this.id] = id;
    rate[this.author] = author;
    this.validate(rate).then(function (errors) {
      if (errors && errors.length > 0) {
        res.status(express_ext_1.getStatusCode(errors)).json(errors).end();
      }
      else {
        _this.act(rate).then(function (rs) {
          return res.status(200).json(rs).end();
        }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
      }
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  return RateController;
}());
exports.RateController = RateController;
var RateCommentController = (function (_super) {
  __extends(RateCommentController, _super);
  function RateCommentController(log, rateCommentService) {
    var _this = _super.call(this, log, rateCommentService) || this;
    _this.rateCommentService = rateCommentService;
    return _this;
  }
  return RateCommentController;
}(express_ext_1.QueryController));
exports.RateCommentController = RateCommentController;
