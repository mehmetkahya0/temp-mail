// Author: Mehmet Kahya
// Created: 17 March 2024

function getUserAndDomain() {
    const addr = $("#addr").val();
    if (!addr) {
      alert("Please generate or input an email address first!");
      return null;
    }
  
    const [user, domain] = addr.split("@");
    return { user, domain };
  }
  
  function genEmail() {
    $.getJSON(
      "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1",
      (res) => {
        $("#addr").val(res[0]);
        refreshMail();
      }
    );
  }
  
  function refreshMail() {
    const { user, domain } = getUserAndDomain();
  
    if (!user || !domain) return;
  
    $.getJSON(
      `https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${domain}`,
      (emails) => {
        const emailsElement = $("#emails");
        emailsElement.empty();
  
        emailsElement.append(`
          <tr>
            <th><b>ID</b></th>
            <th><b>From</b></th>
            <th><b>Subject</b></th>
            <th><b>Date</b></th>
            <th><b>Content</b></th>
          </tr>
        `);
  
        for (const email of emails) {
          emailsElement.append(`
            <tr>
              <td>${email.id}</td>
              <td>${email.from}</td>
              <td>${email.subject}</td>
              <td>${email.date}</td>
              <td id="${email.id}"><a onclick="loadEmail('${email.id}')">Load content...</a></td>
            </tr>
          `);
        }
      }
    );
  }
  
  function loadEmail(id) {
    const { user, domain } = getUserAndDomain();
  
    if (!user || !domain) return;
  
    $.getJSON(
      `https://www.1secmail.com/api/v1/?action=readMessage&login=${user}&domain=${domain}&id=${id}`,
      (email) => {
        const elm = $(`#${id}`);
        if (email.htmlBody) {
          elm.html(email.htmlBody);
        } else {
          elm.text(email.body);
        }
  
        const atts = $("<div></div>");
        for (const file of email.attachments) {
          atts.append(
            `<a href='https://www.1secmail.com/api/v1/?action=download&login=${user}&domain=${domain}&id=${id}&file=${file.filename}'>${file.filename}</a>`
          );
        }
        elm.append(atts);
      }
    );
  }
  
  $(genEmail);