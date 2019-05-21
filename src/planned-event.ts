import moment from "moment";
import settings from "../app-settings.json";
import { number } from "prop-types";
export enum EventTimelineType {
    Past,
    Present,
    Near,
    Future,
}

export class PlannedEvent {
    readonly id: number;
    readonly timelineType: EventTimelineType;
    readonly isWholeDayEvent: boolean;
    readonly startDate: moment.Moment;
    readonly startDateFormated: string;
    readonly startDateHardFormated: string;
    readonly endDate: moment.Moment;
    readonly endDateHardFormated: string;
    readonly topic: string;
    readonly description: string;
    readonly place: string;
    readonly imagePath: string;

	constructor(id: number, start: any, end: any, topic: string, description: string, place: string, imagePath: string = "") {
        this.id = id;

        if (start.date != null) {
            this.isWholeDayEvent = true;
        }
        
        this.startDate = start.date || start.dateTime;
        this.endDate = end.date || end.dateTime;

        this.startDate = moment(this.startDate).locale(settings["moment-locale"]);
        if (this.isWholeDayEvent) {
            this.startDateHardFormated = this.startDate.format("LL");
            this.startDateFormated = this.startDate.calendar(null, {sameDay: (now) => "[Dziś]"});
        }
        else {
            this.startDateHardFormated = this.startDate.format("LLLL");
            this.startDateFormated = this.startDate.calendar();
        }

        this.endDate = moment(this.endDate).locale(settings["moment-locale"]);
        this.endDateHardFormated = this.endDate.format("LLLL");

        this.topic = topic;
        this.description = description;
        this.place = place;
        this.imagePath = imagePath;

        this.timelineType = EventTimelineType.Present;
        
        let dayDifference: number = this.startDate.diff(moment(), 'days');

        if (dayDifference > 14) {
            this.timelineType = EventTimelineType.Future;
        }
        else if (dayDifference > 0) {
            this.timelineType = EventTimelineType.Near;
        }
        else if (dayDifference == 0) {
            this.timelineType = EventTimelineType.Present;
        }
        else {
            this.timelineType = EventTimelineType.Past;
        }
    }
}