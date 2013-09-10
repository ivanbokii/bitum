$(document).ready(function () {
  // the port values is changed during deployment
  var socket = io.connect('http://localhost:3000');

  fillPage(window.bitum.feedsData, false);

  socket.on('message', function (data) {
    fillPage(data, true)
  });

  // Fills page with entries and feed information
  // INPUT: feeds with entries,
  //        isIO parameter that shows whether page is rendered because of
  //        direct page request or using socket io push
  function fillPage (feeds, isIO) {
    feeds.feeds.forEach(function (feed) {
      update(feed, isIO);
    });

    updateLastCheckLabel(moment(feeds.time).format('HH:mm MMM Do'));
  }

  // Updates feed section on the screen. Renders every entry from a feed
  // and adds it to the screen
  // INPUT: feed with entries,
  //        isIO parameter - direct request or socket io push
  function update (feed, isIO) {
    var feedSelector = '.' + feed.name;

    feed.entries.forEach(function (entry) {
      // pubdate is in utc and here we transform it to the local timezone
      // and format to pretty format =)
      entry.pubdate = moment(entry.pubdate).format('HH:mm MMM Do');

      var template = Handlebars.compile($('#entry-template').text());
      var entryHtml = template(entry);

      // there is no need to highlight new entires in case of
      // direct page request
      if (isIO) { entryHtml = setupTemplate(entryHtml); }

      $(feedSelector + ' .entries').prepend(entryHtml);
      $(entryHtml).fadeIn();
    });

    // only 10 news should be shown for each feed
    removeOldNews(feedSelector);
  }

  // Changes input param and adds styles to show that the entry is new
  // INPUT: rendered entry html
  // OUTPUT: styled entry html
  function setupTemplate (entryHtml) {
    //this code should be refactored and css rules moved to css classes
    var updateColor = '#6c9b78';
    var standardNewsColor = '#b3b3b3';

    entryHtml = $(entryHtml).css('border', '3px solid ' + updateColor).hide();
    $(entryHtml).one('mouseover', function () {
      $(this).stop().animate({
        borderTopColor: standardNewsColor,
        borderBottomColor: standardNewsColor,
        borderLeftColor: standardNewsColor,
        borderRightColor: standardNewsColor,
        borderWidth: '1px'
      }, 'fast');
    });

    return entryHtml;
  }

  // Removes oldest entries from a feed
  // INPUT: select of the feed from which we need to remove entries
  function removeOldNews (feedSelector) {
    //page shows only last 10 news
    var news = $(feedSelector + ' .entries div').toArray();
    while (news.length > 10) {
      var entry = news.pop();
      $(entry).remove();
    }
  }

  // Updates label on the screen that shows last check for new entries
  // INPUT: Already formatted time string
  function updateLastCheckLabel (time) {
    $('.main .titles div span')
      .hide()
      .text('last check was at ' + time)
      .fadeIn();
  }
});