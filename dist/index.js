"use strict";

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _faker = require("faker");

var _faker2 = _interopRequireDefault(_faker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getData = async function getData() {
  var json = await (0, _requestPromise2.default)({
    url: "https://randomuser.me/api/?results=2",
    dataType: "json"
  });
  json = JSON.parse(json);

  return json.results.map(function (person) {
    return {
      age: person.dob.age,
      email: person.email,
      firstName: person.name.first,
      lastName: person.name.last
    };
  });
};

async function slackPost() {
  try {
    var people = await getData();
    var slackUrl = "https://hooks.slack.com/services/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";
    var slackBody = {
      mrkdwn: true,
      text: "Slack webhooks testing - " + _faker2.default.hacker.phrase(),
      attachments: people.map(function (person) {
        return {
          color: _faker2.default.internet.color(),
          text: "*Email : " + person.email + "*, name : " + person.firstName + " \n        " + person.lastName + " and age : " + person.age + " "
        };
      })
    };
    console.log(slackBody.attachments);
    var postResponse = await (0, _requestPromise2.default)({
      method: "POST",
      url: slackUrl,
      body: slackBody,
      json: true
    });
    console.log(postResponse);
  } catch (e) {
    console.log("error:::", e);
  }
  debugger;
}
slackPost();