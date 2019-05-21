import {Subject} from "rxjs/Subject";
import {PlannedEvent} from "./planned-event";
import settings from "../gca-settings.json";

var gapiLoadSubject = new Subject();
function handleClientLoad(gapi:any) {
    gapiLoadSubject.next(gapi);
}

(<any>window).handleClientLoad = handleClientLoad;

export default class GoogleCalendarEvents {
    [x: string]: any;

    gapi: any;

    events: Subject<PlannedEvent> = new Subject();

    startClient() : void {
        gapiLoadSubject.subscribe(
           (gapi) => {
               this.gapi = gapi;
                this.gapi.load('client', () => this.initClient());
        });
    }

    initClient() : void {
        this.gapi.client.init({
            apiKey: settings.apiKey,
            discoveryDocs: settings.discoveryDocs,
        })
        .then(() => {
            this.loadPublicEvents();
        });
    }

    loadPublicEvents() : void {

        this.gapi.client.calendar.events.list({
            calendarId: settings.calendarId,
            //timeMin: (new Date()).toDateString(),
            showDeleted: false,
            orderBy: 'startTime',
            singleEvents: true,
            maxResults: 20
        })
        .then((resp: { result: { items: any; }; }) => {
            var evts = resp.result.items;
            if (evts!.length > 0) {
                evts!.forEach((event: any) => {
                    this.events.next(
                        new PlannedEvent(new Date(event.start.dateTime), new Date(event.end.dateTime), event.summary, event.location)
                    )
                });
            }
            this.events.complete();
        });
    }

}
