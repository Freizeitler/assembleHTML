$.getJSON( 'config.json', function(data) {
  var title = data.title;
  var intro = data.intro;
  var content = data.content;
  var atoms = content.atoms.patterns;
  var molecules = content.molecules.patterns;
  var organisms = content.organisms.patterns;
  var colors = content.colors.codes;

  $('.js-title').html(title);
  $('.js-intro').html(intro);

  // Set up navigation + structure
  $.each(content, function(key, val) {
    $('.js-navigation').append('<li class="js-' + key + '"><a href="#' + key + '">' + key + '</a></li>');
    $('.js-content').append('<section id="' + key + '"><h2>' + key + '</h2><p>' + this.description + '</p></section><p class="top-link"><a href="#top">to top</a></p>');
  });
  $.each(atoms, function(key, val) {
    $('.js-atoms').append('<ul><li><a href="#' + key + '">' + key + '</a></li></ul>');
  });
  $.each(molecules, function(key, val) {
    $('.js-molecules').append('<ul><li><a href="#' + key + '">' + key + '</a></li></ul>');
  });
  $.each(organisms, function(key, val) {
    $('.js-organisms').append('<ul><li><a href="#' + key + '">' + key + '</a></li></ul>');
  });

  // Set up color boxes
  $.each(colors, function(i, item) {
    $('#colors').append('<div class="color-cube" style="background-color: ' + item + ';"></div>');
  });

  // Set up sections
  $.each(atoms, function(key, val) {
    var template = '<div class="' + key + '"><h3 id="' + key + '">' + key + '</h3><p>' + val + '</p><iframe src="_patterns/atoms/' + key + '/index.html"></iframe><xmp class="snippet-' + key +' sg-code"></xmp></div>';
    $('#atoms').append(template);
    $.get('_patterns/atoms/' + key + '/index.html', function(data) {
      var origHTML = $(data).filter('#snippet');
      var innerHTML = origHTML.children().prop('outerHTML');
      $('.snippet-' + key).html(innerHTML);
    });
  });
   $.each(molecules, function(key, val) {
    var template = '<div><h3 id="' + key + '">' + key + '</h3><p>' + val + '</p><iframe src="_patterns/molecules/' + key + '/index.html"></iframe><xmp class="snippet-' + key +' sg-code"></xmp></div>';
    $('#molecules').append(template);
    $.get('_patterns/molecules/' + key + '/index.html', function(data) {
      var origHTML = $(data).filter('#snippet');
      var innerHTML = origHTML.children().prop('outerHTML');
      $('.snippet-' + key).html(innerHTML);
    });
  });
    $.each(organisms, function(key, val) {
    var template = '<div><h3 id="' + key + '">' + key + '</h3><p>' + val + '</p><iframe src="_patterns/organisms/' + key + '/index.html"></iframe><xmp class="snippet-' + key +' sg-code"></xmp></div>';
    $('#organisms').append(template);
    $.get('_patterns/organisms/' + key + '/index.html', function(data) {
      var origHTML = $(data).filter('#snippet');
      var innerHTML = origHTML.children().prop('outerHTML');
      $('.snippet-' + key).html(innerHTML);
    });
  });
});
