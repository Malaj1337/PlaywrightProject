import { test, expect } from '@playwright/test';
import { tempData } from '../test-data/practicetestautomation.data';
import { PracticePage } from '../pages/practicetestautomation.page';

test.describe('Test login - practice automation', () => {
  let tempTest: PracticePage;
  test.beforeEach(async ({ page }) => {
    tempTest = new PracticePage(page);
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });
  test('Positive LogIn test', async ({ page }) => {
    //Arrane
    const userID = tempData.userID;
    const userPassword = tempData.userPassword;
    const expectedMessage = 'Logged In Successfully';
    const expectedMessage2 =
      'Congratulations student. You successfully logged in!';
    //Act
    await tempTest.login(userID, userPassword);
    //Assert
    await expect(tempTest.loginHeading).toHaveText(expectedMessage);
    await expect(tempTest.loginSubHeading).toHaveText(expectedMessage2);
  });

  test('Negative username test', async ({ page }) => {
    //Arrange
    const incorrectID = 'incorrectUser';
    const userPassword = tempData.userPassword;
    const wrongIDmessage = 'Your username is invalid!';
    //Act
    await page.getByRole('textbox', { name: 'Username' }).fill(incorrectID);
    await page.getByRole('textbox', { name: 'Password' }).fill(userPassword);
    await page.getByRole('button', { name: 'Submit' }).click();
    //Assert
    await expect(tempTest.wrongID).toHaveText(wrongIDmessage);
  });

  test('Negative password test', async ({ page }) => {
    //Arrange
    const userID = tempData.userID;
    const wrongPassword = 'incorrectPassword';
    const wrongPassmessage = 'Your password is invalid!';
    //Act
    await page.getByRole('textbox', { name: 'Username' }).fill(userID);
    await page.getByRole('textbox', { name: 'Password' }).fill(wrongPassword);
    await page.getByRole('button', { name: 'Submit' }).click();
    //Assert
    await expect(tempTest.wrongID).toHaveText(wrongPassmessage);
  });
});

test.describe('Test Exceptions', () => {
  let tempTest: PracticePage;
  test.beforeEach(async ({ page }) => {
    tempTest = new PracticePage(page);
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });
  test('TC1-NoSuchElementException', async ({ page }) => {
    //Arrange
    //Act
    await tempTest.rowAdd();
    await tempTest.rowAdded
      .nth(1)
      .waitFor({ state: 'visible', timeout: 10000 });
    await tempTest.rowAdded.nth(1).click();
    //Assert
    await expect(page.locator('#confirmation')).toBeVisible();
  });

  test('TC2-ElementNotInteractableException', async ({ page }) => {
    //Arrange
    const row2saved = 'Row 2 was saved';
    const boxText = 'testtext';
    //Act
    await tempTest.rowAdd();
    await tempTest.rowAdded
      .nth(1)
      .waitFor({ state: 'visible', timeout: 10000 });
    await tempTest.rowAdded.nth(1).fill(boxText);
    await tempTest.saveButton.click();
    //Assert
    await expect(tempTest.rowSaved).toHaveText(row2saved);
    await expect(tempTest.rowAdded.nth(1)).toHaveValue(boxText);
  });

  test('TC3-InvalidElementStateException', async ({ page }) => {
    //Arrange
    const boxText = 'testtext';
    //Act
    await tempTest.rowAdd();
    await tempTest.rowAdded
      .nth(1)
      .waitFor({ state: 'visible', timeout: 10000 });
    await tempTest.rowAdded.nth(1).fill(boxText);
    await tempTest.saveButton.click();
    await tempTest.editButton.click();
    await tempTest.rowAdded.nth(1).clear();
    //Assert
    await expect(tempTest.rowAdded.nth(1)).toHaveValue('');
  });

  test('TC4-StaleElementReferenceException', async ({ page }) => {
    //Arrange
    const expectedInstruction = 'Push “Add” button to add another row';
    //Act
    await tempTest.practiceTab.click();
    await tempTest.testExceptions.click();
    await expect(tempTest.instructionRow).toHaveText(expectedInstruction);
    await tempTest.addRow.click();
    //Assert
    await expect(tempTest.instructionRow).toHaveCount(0);
  });
});
