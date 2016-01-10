describe('PhoneCat App', function() {

  describe('Phone list view', function() {

    beforeEach(function() {
      browser.get('index.html');
    });


    it('should filter the blog list as a user types into the search box', function() {

      var blogList = element.all(by.repeater('blog in blogs'));

      expect(blogList.count()).toBe(3);
    });
  });
});