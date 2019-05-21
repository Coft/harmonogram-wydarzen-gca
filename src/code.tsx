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
                    //.sort((pe1, pe2) => pe1.startDate > pe2.startDate ? 1 : -1)
                    .map(
                    (plannedEvent, i) => { 
                        let cardStyle = {
                            maxWidth: 540
                        }
                        
                        let colorOption = "";
                        switch (plannedEvent.timelineType) {
                            case EventTimelineType.Past :
                                colorOption = "secondary";
                                break;
                            case EventTimelineType.Present:
                                colorOption += "warning";
                                break;
                            case EventTimelineType.Near :
                                colorOption += "success";
                                break;
                            case EventTimelineType.Future:
                                colorOption += "primary";
                                break;
                            default:
                                colorOption = "light";
                                break;

                        }

                        let cardBodyClassName = `card-body text-${colorOption}`;
                        let cardClassName = `card mb-3 border-${colorOption}`;

                        return <div className={cardClassName} style={cardStyle} key={i}>
                            <div className="row no-gutters">
                              <div className="col-md-4">
                               {plannedEvent.imagePath &&
                                    <img src={plannedEvent.imagePath} className="card-img" alt="event image"/>
                               }
                              </div>
                              <div className="col-md-8">
                                <div className={cardBodyClassName}>
                                  <h5 className="card-title">{plannedEvent.topic}</h5>
                                  <p className="card-text">{plannedEvent.startDateFormated}</p>
                                  <p className="card-text">
                                      <small className="text-muted">{plannedEvent.startDateHardFormated}</small>
                                    </p>
                                  <p className="card-text">{plannedEvent.description}</p>
                                  <p className="card-text">{plannedEvent.place}</p>
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