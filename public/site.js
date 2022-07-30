(function() {
  document.getElementById('hideChat').onclick = () => {
    document.getElementById('chat').style.display = 'none';
    document.getElementById('hideChat').style.opacity = '0';
    document.getElementById('showChat').style.opacity = '1';
  };
  document.getElementById('showChat').onclick = () => {
    document.getElementById('chat').style.display = 'block';
    document.getElementById('showChat').style.opacity = '0';
    document.getElementById('hideChat').style.opacity = '1';
  };

  const info = async () => {
    let list = '';
    let chat = '';
    const { data } = await axios.get('/info');
    data.consumers.forEach(consumer => {
      list += `<li class="list-group-item">${consumer.name}<li>`;
    });
    document.getElementById('consumers').innerHTML = `<ul class="list-group">${list}</ul>`;

    data.history.forEach(msg => {
      chat += `<div class="msg"><span class="text-muted">${msg.name}, ${moment(msg.time).fromNow()}</span><p class="message">${msg.message}</p></div>`;
    });

    document.getElementById('chat').innerHTML = chat;
    var objDiv = document.getElementById("chat");
    objDiv.scrollTop = objDiv.scrollHeight;
  };
  setInterval(info, 1000);
  info();
})();
