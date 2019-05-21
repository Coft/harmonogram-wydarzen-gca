import moment from "moment";
import settings from "../app-settings.json";

export enum EventTimelineType {
    Past,
    Present,
    Near,
    Future,
}

export class PlannedEvent {
    readonly timelineType: EventTimelineType;
    readonly startDate: moment.Moment;
    readonly startDateFormated: string;
    readonly startDateHardFormated: string;
    readonly endDate: moment.Moment;
    readonly endDateFormated: string;
    readonly endDateHardFormated: string;
    readonly topic: string;
    readonly place: string;
    readonly imagePath: string;

	constructor(startDate: Date, endDate: Date, topic: string, place: string, imagePath: string = "") {
        this.startDate = moment(startDate);
        this.startDateFormated = moment(startDate).locale(settings["moment-locale"]).calendar();
        this.startDateHardFormated = moment(startDate).locale(settings["moment-locale"]).format("LLLL");
        this.endDate = moment(endDate);
        this.endDateFormated = moment(endDate).locale(settings["moment-locale"]).calendar();
        this.endDateHardFormated = moment(endDate).locale(settings["moment-locale"]).format("LLLL");
        this.topic = topic;
        this.place = place;
        this.imagePath = imagePath;

        this.timelineType = EventTimelineType.Present;
        
        let dayDifference: number = moment().diff(startDate, 'days');

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