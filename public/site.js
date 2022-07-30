(function() {
  document.getElementById('hideChat').onclick = () => {
    document.getElementById('chat').style.display = 'none';
    document.getElementById('chat-wrapper').style.opacity = '0.65';
    document.getElementById('hideChat').style.opacity = '0';
    document.getElementById('showChat').style.opacity = '1';
  };
  document.getElementById('showChat').onclick = () => {
    document.getElementById('chat').style.display = 'block';
    document.getElementById('chat-wrapper').style.opacity = '0.9';
    document.getElementById('showChat').style.opacity = '0';
    document.getElementById('hideChat').style.opacity = '1';
  };

  document.getElementById('hideGuests').onclick = () => {
    document.getElementById('consumers').style.display = 'none';
    document.getElementById('guest-wrapper').style.opacity = '0.65';
    document.getElementById('hideGuests').style.opacity = '0';
    document.getElementById('showGuests').style.opacity = '1';
  };
  document.getElementById('showGuests').onclick = () => {
    document.getElementById('consumers').style.display = 'block';
    document.getElementById('guest-wrapper').style.opacity = '0.9';
    document.getElementById('showGuests').style.opacity = '0';
    document.getElementById('hideGuests').style.opacity = '1';
  };

  const info = async (first = false) => {
    let list = '';
    let chat = '';
    const consumersLength = localStorage.getItem('consumersLength') || 0;
    const historyLength = localStorage.getItem('historyLength') || 0;
    const { data } = await axios.get('/info');

    if (!data.started) {
      
    }

    if (first || consumersLength != data.consumers.length) {
      data.consumers.forEach(consumer => {
        list += `<li class="list-group-item">${consumer.name} <span class="badge badge-sm badge-secondary">${moment(consumer.time).fromNow()}</span></li>`;
      });
      document.getElementById('consumers').innerHTML = `<ul class="list-group">${list}</ul>`;
      document.getElementById('guestCount').innerHTML = `[${data.consumers.length}]`;
    }

    if (first || historyLength != data.history.length) {
      data.history.forEach(msg => {
        chat += `<div class="msg"><span class="text-muted">${msg.name}, ${moment(msg.time).fromNow()}</span><p class="message">${msg.message}</p></div>`;
      });

      document.getElementById('messages').innerHTML = chat;
      document.getElementById('chatCount').innerHTML = `[${data.history.length}]`;
      var objDiv = document.getElementById("chat");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    localStorage.setItem('historyLength', data.history.length);
    localStorage.setItem('consumersLength', data.consumers.length);
  };
  setInterval(info, 1000);
  info(true);
})();
