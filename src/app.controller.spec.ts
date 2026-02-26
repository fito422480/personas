import { AppController } from "./app.controller";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController();
  });

  it("should return health status", () => {
    expect(appController.health()).toEqual({ status: "ok" });
  });
});
