import { AngularAdminLTEPage } from './app.po';

describe('Maviba Institute App', () => {
  let page: AngularAdminLTEPage;

  beforeEach(() => {
    page = new AngularAdminLTEPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
