import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GoogleCalendarEvents from './calendar-events'

import {PlannedEvent, EventTimelineType} from './planned-event';
import { Observable, Subscription } from 'rxjs';

class App extends React.Component<{}, {data: PlannedEvent[]}>{

    calendarSubscription: Subscription;

    calendar: GoogleCalendarEvents;


    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {data: []};
        this.calendar = new GoogleCalendarEvents();

        this.calendar.startClient();
    }

    componentDidMount() {
        this.calendarSubscription = this.calendar.events.subscribe(
            (event) => {
                this.state.data.push(event);
                this.setState(this.state);
            });
    }

    componentWillUnmount() {
        this.calendarSubscription.unsubscribe();
    }

    render() {
        
        return (
            <div>
                {this.state.data
                    .sort((pe1, pe2) => pe1.startDate > pe2.startDate ? 1 : -1)
                    .map(
                    (plannedEvent) => { 
                        let cardStyle = {
                            maxWidth: 540
                        }
                        let cardClassName = "card mb-3";
                        let cardBodyClassName = "card-body";
                        switch (plannedEvent.timelineType) {
                            case EventTimelineType.Past :
                                cardClassName += " border-secondary";
                                cardBodyClassName += " text-secondary";
                                break;
                                case EventTimelineType.Future:
                                cardClassName += " border-primary";
                                cardBodyClassName += " text-primary";
                                break;
                        
                        }
                        return <div className={cardClassName} style={cardStyle}>
                            <div className="row no-gutters">
                              <div className="col-md-4">
                               {plannedEvent.imagePath &&
                                    <img src="..." className="card-img" alt="..."/>
                               }
                              </div>
                              <div className="col-md-8">
                                <div className={cardBodyClassName}>
                                  <h5 className="card-title">{plannedEvent.topic}</h5>
                                  <p className="card-text">{plannedEvent.startDateFormated}</p>
                                  <p className="card-text">{plannedEvent.place}</p>
                                  <p className="card-text">Description</p>
                                  <p className="card-text"><small className="text-muted">Date ago or date to event</small></p>
                                </div>
                              </div>
                            </div>
                          </div>
                    })}
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);