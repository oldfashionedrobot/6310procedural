/*
Start
prompt
view
next

*/




(function () {
  const input = $('#search');
  const container = $('#container');
  const pageSize = 25;
  let page = 0;
  let lastTerm = '';

  const stages = [];


  input.on('keypress', (e) => {
    if (e.which == '13') {
      if (stages.length == 0)
        search(input.val());
      else
        proceed(input.val());
    }
  });

  $('#btn').on('click', (e) => {
    if (stages.length == 0)
      search(input.val());
    else
      proceed(input.val());
  });

  $('#load-btn').on('click', () => {
    loadMore();
  });

  $('#start').on('click', () => {
    proceed(lastTerm);
  });

  $('#container').on('click', '.continue', () => {
    nextStage();
  });

  $('#container').on('click', '.finish', () => {
    finishGame();
  });

  function search(term, append) {
    if (term) lastTerm = term;
    else term = lastTerm;

    fetch(giphySearchURL(term)).then((response) => {
      return response.json();
    }, (reason) => {
      console.log("REJECTED ", reason);
    }).then(response => {
      if (!append)
        container.children().remove();
      response.data.forEach((res) => {
        var img = $('<img src="' + res.images.original.url + '">');
        container.append(img);
      });

      showControls();
    })
  };

  function showControls() {
    if (stages.length == 0) {
      // start stage
      $('#start').show();
    }

    $('#load-btn').show();
  }

  function proceed(term) {
    lastTerm = term;

    if (stages.length == 0) {
      // begin game
      stages[0] = {
        stage: 0,
        word: term
      }

      $('#start').hide();
      input.next().text('Guess Word(s)');

    } else {
      stages.push({
        stage: stages.length,
        word: term,
        elements: container.children().clone()
      });
    }

    input.val('');
    $('#load-btn').hide();
    $('#search-wrapper').hide();
    container.children().remove();
    container.append('<p class="prompt">Hand off to the next player</p>');
    container.append('<p class="prompt"><button class="continue big">Continue</button> or <button class="finish big">Finish Game</button></p>');

    console.log(stages);
  }

  function nextStage() {
    search(stages[stages.length - 1].word, false);
    $('#search-wrapper').show();
  }

  function finishGame() {
    container.children().remove();

    stages.forEach((stage, idx) => {

      if (idx > 0) {
        var imgys = $('<p class="prompt img"></p>');
        imgys.append(stage.elements);
        container.append(imgys);
      }
      container.append(`<p class="prompt">${stage.word}</p>`);

    });
  }

  function loadMore() {
    page++;
    search(undefined, true);
  }

  function giphySearchURL(term) {
    return `https://api.giphy.com/v1/gifs/search?api_key=Xxbd0WPUTfoA5EP3w0ZHmMgLGtVw8yZ3&q=${term}&limit=${pageSize}&offset=${page * pageSize}&rating=pg-13&lang=en`
  }

})();