import pug from "pug";
import AppError, { errorKinds } from "../utils/AppError";

class View {
  private static readonly viewPath = `${__dirname}/../views/`;
  private renderFile;

  constructor(renderFile: any) {
    this.renderFile = renderFile;
  }

  static render(view: string, data: any) : View {
    try{
        const renderFile = pug.renderFile(View.viewPath + view + `.pug`, data);
        return new View(renderFile);
    }catch(err){
        console.log(err)
        throw new AppError(errorKinds.internalServerError, "Invalid view");
    }
  }

  getHtmlFile() : any{
    return this.renderFile
  }

}

export default View;
