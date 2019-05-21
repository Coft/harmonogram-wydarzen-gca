export enum EventTimelineType {
    Past,
    Present,
    Near,
    Future,
}

export class PlannedEvent {
    readonly timelineType: EventTimelineType;
    readonly startDate: Date;
    readonly startDateFormated: string;
    readonly endDateFormated: string;
    readonly topic: string;
    readonly place: string;
    readonly imagePath: string;

	constructor(startDate: Date, endDate: Date, topic: string, place: string, imagePath: string = "") {
        this.startDate = startDate;
        this.startDateFormated = startDate.toString();
        this.endDateFormated = endDate.toString();
        this.topic = topic;
        this.place = place;
        this.imagePath = imagePath;

        this.timelineType = EventTimelineType.Present;
        
        let today: Date = new Date();
        if (today > startDate) {
            this.timelineType = EventTimelineType.Past;
        }
        else if (startDate > today) {
            this.timelineType = EventTimelineType.Future;
        }
    }
}