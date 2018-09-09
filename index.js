import request from "request-promise";
import faker from "faker";

const getData = async function() {
  let json = await request({
    url: "https://randomuser.me/api/?results=2",
    dataType: "json"
  });
  json = JSON.parse(json);

  return json.results.map(person => ({
    age: person.dob.age,
    email: person.email,
    firstName: person.name.first,
    lastName: person.name.last
  }));
};

async function slackPost() {
  try {
    const people = await getData();
    const slackUrl =
      "https://hooks.slack.com/services/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";
    const slackBody = {
      mrkdwn: true,
      text: `Slack webhooks testing - ${faker.hacker.phrase()}`,
      attachments: people.map(person => ({
        color: faker.internet.color(),
        text: `*Email : ${person.email}*, name : ${person.firstName} 
        ${person.lastName} and age : ${person.age} `
      }))
    };
    console.log(slackBody.attachments);
    let postResponse = await request({
      method: "POST",
      url: slackUrl,
      body: slackBody,
      json: true
    });
    console.log(postResponse);
  } catch (e) {
    console.log("error:::", e);
  }
}
slackPost();
