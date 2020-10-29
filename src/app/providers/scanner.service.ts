import { Injectable, NgZone  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  public contentHeight;
  public delegate: ScannerDelegate;

  public barcodeCapture;
  public session;
  private context;
  private camera;
  private settings;
  private view;
  private overlay;

  constructor(
    private zone: NgZone,
  ) {
    this.context = Scandit.DataCaptureContext.forLicenseKey('AYN/Ozi4J34aAEoW2hjRAx8G3/wkFdQUHAfczs1QyEjPfnPWGFr1BFYHVRamf87K7VENiZ5zTitQPCf45n8sJCRlwpVAcJcBf0X2iV1vp2BXP7c/hRq1DYAQENjDA7UT2/GhntyW/A8JUVtuHol0xit/e/YZMRs7064QO0WSQHWb8Db3kXnborIzqTol2b87bmXkymDw0jMnpWGWonYW+5QvH/zBmd9UVAay/xkY+ZGljjxRetewUkuKwhPNcur2LhRX0he9ZPxlkDFIlWLcSKc8YWEBr0Cs3uRuDqx856ezhub84JctKjI7G2Pbdbw81m5dy4P2s2d1WrmhGc+xgKmteEubhTGF4DI8rvlHYEjp7l68Kjbm5SU9d7cCBYN38g794mlHo4MVtCKEAjd2ndeXvM4Ekjk3ePECbfm6yN2G9GOl9bKBp6O0v8igF3+YonAuWairVZzfeBHuHYJD9FsXAoIlUXVO8GwiIgMMQ6w2WCk7Kbx1Jq+r6axmelitniJ1xmuA8r97gqhGHZIEZZiwOuXsWBoGTa69uUNPuP6fasvo/VsnBb/b7QkdlZFLUoFuUNk4ulrSlrDhNT90hsEbbSYt3N1uyKMFV6d4bB/nBAGI76i+B7Kw7my5QwUQO2eTR1hmu3DcZW/BJLDXHF+p5AqXbgy1gpINwNvkYtgmXPSBuc3kC6vYdD2rrRw26CU+gkCswODjikqTIzV+lIXqg1ZrNGeOTCcRgcudtqnSkwpKjfjQV0REku/Gu5eJlZQsAUxT14nDQY67cTUTysApE8DTzFIzeU9uVSBn');
    this.camera = Scandit.Camera.default;
    this.context.setFrameSource(this.camera);

    this.settings = new Scandit.BarcodeCaptureSettings();

    this.settings.enableSymbologies([
      Scandit.Symbology.EAN13UPCA,
      Scandit.Symbology.EAN8,
      Scandit.Symbology.UPCE,
      Scandit.Symbology.QR,
      Scandit.Symbology.DataMatrix,
      Scandit.Symbology.Code39,
      Scandit.Symbology.Code128,
      Scandit.Symbology.InterleavedTwoOfFive,
    ]);
    this.settings.codeDuplicateFilter = -1;
    this.barcodeCapture = Scandit.BarcodeCapture.forContext(this.context, this.settings);
    this.barcodeCapture.applySettings(this.settings)
    this.barcodeCapture.addListener({
      didScan: (barcodeCapture, session) => {
        if (this.delegate) {
          this.zone.run(() => {
            this.delegate.didScan(barcodeCapture, session);
          })
        }
      },
    });
  }

  public start(): void {
    this.view = Scandit.DataCaptureView.forContext(this.context);
    this.view.connectToElement(document.getElementById('scanner'));
    this.overlay = Scandit.BarcodeCaptureOverlay.withBarcodeCaptureForView(this.barcodeCapture, this.view);
    this.overlay.viewfinder = new Scandit.RectangularViewfinder();
    this.camera.switchToDesiredState(Scandit.FrameSourceState.On);
    this.barcodeCapture.isEnabled = true;
  }

  public resume(): void {
    this.barcodeCapture.isEnabled = true;
  }
  public pause(): void {
    this.barcodeCapture.isEnabled = false;
  }

}
