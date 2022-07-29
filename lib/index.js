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
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_ext_1 = require("express-ext");
var RateController = /** @class */ (function () {
  function RateController(log, rateService, validator, commentValidator, generate, commentId, userId, author, id) {
    this.log = log;
    this.rateService = rateService;
    this.validator = validator;
    this.commentValidator = commentValidator;
    this.generate = generate;
    this.id = (id && id.length > 0 ? 'id' : id);
    this.author = (author && author.length > 0 ? 'author' : author);
    this.userId = (userId && userId.length > 0 ? 'userId' : userId);
    this.commentId = (commentId && commentId.length > 0 ? 'commentId' : commentId);
    this.load = this.load.bind(this);
    this.rate = this.rate.bind(this);
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.search = this.search.bind(this);
    this.dates = ['time'];
    this.numbers = ['rate', 'usefulCount', 'replyCount', 'count', 'score'];
  }
  RateController.prototype.search = function (req, res) {
    var _this = this;
    var s = express_ext_1.fromRequest(req, express_ext_1.buildArray(undefined, 'fields'));
    var l = express_ext_1.getParameters(s);
    var s2 = express_ext_1.format(s, this.dates, this.numbers);
    this.rateService.search(s2, l.limit, l.skipOrRefId, l.fields)
      .then(function (result) { return express_ext_1.jsonResult(res, result, false, l.fields); })
      .catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  RateController.prototype.load = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var author = req.params[this.author];
    this.rateService.getRate(id, author).then(function (rate) {
      if (rate) {
        return res.status(200).json(rate).end();
      }
      else {
        return res.status(401).json(null).end();
      }
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  RateController.prototype.rate = function (req, res) {
    var _this = this;
    var rate = req.body;
    rate.time = new Date();
    this.validator.validate(rate).then(function (errors) {
      if (errors && errors.length > 0) {
        res.status(express_ext_1.getStatusCode(errors)).json(errors).end();
      }
      else {
        _this.rateService.rate(rate).then(function (rs) {
          return res.status(200).json(rs).end();
        }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
      }
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  RateController.prototype.setUseful = function (req, res) {
    var _this = this;
    var id = req.params.id;
    var author = req.params.author;
    var userId = req.params.userId;
    this.rateService.setUseful(id, author, userId).then(function (rs) {
      return res.status(200).json(rs).end();
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  RateController.prototype.removeUseful = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var author = req.params[this.author];
    var userId = req.params[this.userId];
    this.rateService.removeUseful(id, author, userId).then(function (rs) {
      return res.status(200).json(rs).end();
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  RateController.prototype.comment = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var author = req.params[this.author];
    var userId = req.params[this.userId];
    var commentId = this.generate();
    var comment = __assign({ commentId: commentId, id: id, author: author, userId: userId }, req.body);
    this.commentValidator.validate(comment).then(function (errors) {
      if (errors && errors.length > 0) {
        res.status(express_ext_1.getStatusCode(errors)).json(errors).end();
      }
      else {
        _this.rateService.comment(comment).then(function (rep) {
          return res.status(200).json(rep).end();
        }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
      }
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  RateController.prototype.removeComment = function (req, res) {
    var _this = this;
    var commentId = req.params[this.commentId];
    var author = req.params[this.author];
    this.rateService.removeComment(commentId, author).then(function (reply) {
      return res.status(200).json(reply).end();
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  RateController.prototype.updateComment = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var author = req.params[this.author];
    var userId = req.params[this.userId];
    var commentId = req.params[this.commentId];
    var comment = __assign({ commentId: commentId, id: id, author: author, userId: userId }, req.body);
    this.commentValidator.validate(comment).then(function (errors) {
      if (errors && errors.length > 0) {
        res.status(express_ext_1.getStatusCode(errors)).json(errors).end();
      }
      else {
        _this.rateService.updateComment(comment).then(function (rep) {
          return res.status(200).json(rep).end();
        }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
      }
    }).catch(function (err) { return express_ext_1.handleError(err, res, _this.log); });
  };
  return RateController;
}());
exports.RateController = RateController;
// tslint:disable-next-line:max-classes-per-file
var RateCommentController = /** @class */ (function (_super) {
  __extends(RateCommentController, _super);
  function RateCommentController(log, rateCommentService) {
    var _this = _super.call(this, log, rateCommentService) || this;
    _this.rateCommentService = rateCommentService;
    return _this;
  }
  return RateCommentController;
}(express_ext_1.ViewController));
exports.RateCommentController = RateCommentController;
