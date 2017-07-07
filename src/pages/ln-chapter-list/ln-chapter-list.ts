import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { NovelsService } from "../../providers/novels-service";
import { Chapter } from "../../common/models/chapter";
import { ChaptersService } from "../../providers/chapters-service";
import { LnLoadingController } from "../../common/ln-loading-controller";
import { DownloadService } from "../../providers/download-service";

@IonicPage()
@Component({
  selector: "ln-chapter-list",
  templateUrl: "ln-chapter-list.html",
})
export class LnChapterListPage {
  chapters: Chapter[] = [];
  isFinishedLoading: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public novelService: NovelsService,
    public chaptersService: ChaptersService,
    private downloadService: DownloadService,
    private loadingCtrl: LnLoadingController) {
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter LnChapterListPage");
    this.loadingCtrl.presentLoadingMessage();
    let id = this.navParams.data;
    this.novelService
      .getNovelChapterList(id)
      .then(chapters => {
        this.chapters = chapters;
        this.isFinishedLoading = true;
        this.toggleRead();
        this.loadingCtrl.hideLoadingMessage();
      });
  }

  private toggleRead() {
    if (!this.isFinishedLoading) {
      return;
    }
    this.chapters.forEach(chapter => {
      this.checkIfChapterIsRead(chapter);
    });
  }

  checkIfChapterIsRead(chapter) {
    this.chaptersService
      .isRead(chapter.id)
      .then(() => {
        chapter.isRead = true;
      })
      .catch(() => {
        chapter.isRead = false;
      });
  }

  openChapter(chapter) {
    // put settimeout to hide the animation to the user
    setTimeout(() => {
      chapter.isRead = true;
    }, 500);
    this.navCtrl.push('LnChapterPage', {
      novelId: this.navParams.data,
      chapterNumber: chapter.number
    });
  }

}
