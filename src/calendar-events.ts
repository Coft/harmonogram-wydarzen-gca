import {Subject} from "rxjs/Subject";
import {PlannedEvent} from "./planned-event";
import settings from "../app-settings.json";
import moment from "moment";


var gapiLoadSubject = new Subject();
function handleClientLoad(gapi:any) {
    gapiLoadSubject.next(gapi);
}

(<any>window).handleClientLoad = handleClientLoad;

export default class GoogleCalendarEvents {
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
            //timeMin: moment().subtract(3, 'months').toISOString(),
            showDeleted: false,
            orderBy: 'startTime',
            singleEvents: true,
            maxResults: 40
        })
        .then((resp: { result: { items: any; }; }) => {
            var evts = resp.result.items;
            if (evts!.length > 0) {
                evts!.forEach((event: any) => {
                    this.events.next(
                        new PlannedEvent(
                            event.id,
                            event.start,
                            event.end,
                            event.summary,
                            event.description,
                            event.location,
                            "https://via.placeholder.com/150"
                        )
                    )
                });
            }
            this.events.complete();
        });
    }

}
