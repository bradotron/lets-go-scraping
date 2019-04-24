$(`.btn-scrape`).click(function(event) {
  $.ajax({
    url: "/articles/scrape",
    type: "GET",
    success: function(data) {
      alert("Scrape Complete.");
      location.reload();
    },
    error: function(request, error) {
      alert("Request: " + JSON.stringify(request));
    }
  });
});

$(`.btn-delete-article`).click(function(event) {
  let url = `/articles/article/${$(this).data("article-id")}`;
  console.log(url);
  $.ajax({
    url: url,
    type: "DELETE",
    success: function(data) {
      location.reload();
    },
    error: function(req, err) {
      alert("Request: " + JSON.stringify(request));
    }
  });
});

$(`.btn-comment`).click(function(event) {
  let url = `/comments/comment`;
  let data = {
    articleId: $(this).data(`article-id`),
    author: $(`.author-input`).val(),
    comment: $(`.comment-input`).val()
  };

  if (data.author && data.comment) {
    $.ajax({
      url: url,
      type: "POST",
      data: data,
      success: function(data) {
        location.reload();
      },
      error: function(request, error) {
        alert("Request: " + JSON.stringify(request));
      }
    });
  } else {
    alert("Please input an name and a comment.");
  }
});
