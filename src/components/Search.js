import React, {Component, Fragment} from 'react';
import {Grid, Input, Dropdown, Form, Image, Icon , Modal, Header, Button} from 'semantic-ui-react';
import {data} from '../data'

const continents = [
    {key: 'afr', value: 1, text: "Afryka"},
    {key: 'apd', value: 2, text: "Ameryka Południowa"},
    {key: 'apn', value: 3, text: "Ameryka Północna"},
    {key: 'aus', value: 4, text: "Australia i Oceania"},
    {key: 'azj', value: 5, text: "Azja"},
    {key: 'eur', value: 6, text: "Europa"}
];
const initialRange = 1999;



class Search extends Component {
    state = {
        DropdownValue: '',
        rangeValue: initialRange,
        searchQuery: '',
        drop: '',
        results: data,
        searchTargetValue: '',
        selectedContinent: '',
        selectedTrip: null,
        favorites: []
    };

    componentDidMount() {
        // 1. get user favorites from firebase
        // 2. set current state to that data

        const favorites = JSON.parse(localStorage.getItem('favorites')) || []
        this.setState({
            favorites
        })
    }

    handleFavIcon(tripId) {
        const {favorites: prevFavorites} = this.state
        if (prevFavorites.includes(tripId)) {
            const nextFavorites = prevFavorites.filter(id => id !== tripId);
            this.setState({
                favorites: nextFavorites
            }, () => {
                // 1. get current logged in user (firebase.auth().currentUser)
                // 2. get his id (currentUser.uid)
                // 3. upload favorites to firebase to that user
                localStorage.setItem('favorites', JSON.stringify(this.state.favorites))
            })
        } else {
            const nextFavorites = [...prevFavorites, tripId];
            this.setState({
                favorites: nextFavorites
            }, () => {
                localStorage.setItem('favorites', JSON.stringify(this.state.favorites))
            })
        }
    }

    queryOutput() {
        return (this.filteredResults.map(trip => (
                <div key={trip.id}>
                    <Grid.Column style={{padding: '0 2rem'}} onClick={() => {
                        this.setState({
                            selectedTrip: trip
                        })
                    }}>
                        <div style={{position: 'relative'}}>
                            <Image
                                className="TripImage"
                                // onClick={() => rangeValue(trip.id)}
                                src={trip.img}
                                label={{
                                    ribbon: true,
                                    color: "blue",
                                    content: `${trip.city}`
                                }}
                                centered={true}
                            >
                            </Image>
                            <Icon
                                className={'iconFavourites'}
                                size={'large'}
                                name={this.state.favorites.includes(trip.id) ? 'heart' : 'heart outline'}
                                color={'white'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.handleFavIcon(trip.id)
                                }}/>
                        </div>
                        <p>{trip.title}</p>
                    </Grid.Column>
                </div>
            ))
        )
    }

    handleRange = (e, data) => {
        this.setState({
            rangeValue: Number(e.target.value)
        })
    };

    handleSelect = (e, data) => {
        this.setState({
            selectedContinent: data.value
        })
    };

    handleInputChange = e => {
        this.setState({
            searchQuery: e.target.value
        })
    };

    get filteredResults() {
        const {searchQuery, selectedContinent, rangeValue} = this.state;
        const continent = continents.find(continent => {
            return continent.value === selectedContinent
        });
        const continentText = continent ? continent.text : '';
        return this.state.results.filter(trip => {
            return (
                trip.continent.toLowerCase().includes(continentText.toLowerCase()) &&
                trip.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                Number(trip.price) < rangeValue ||
                trip.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
                trip.continent.toLowerCase().includes(continentText.toLowerCase()) &&
                Number(trip.price) < rangeValue
            )
        })
    }

    handleChange = (e, {name, value}) => this.setState({[name]: value});

    render() {
        const {selectedTrip} = this.state

        return (
            <div className="search">
                <Grid padded={true}>
                    <Grid.Row columns={1} centered={true}>
                        <Grid.Column width={12}>
                            <Input
                                onChange={this.handleInputChange}
                                placeholder='Gdzie chesz pojechać?'
                                fluid
                                value={this.state.searchQuery}
                            />
                            <datalist id='places'>
                                {data.map(v => <option key={v.id}> {v.city}</option>)}
                            </datalist>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2} centered={true}>
                        <Grid.Column width={6}>
                            <Dropdown
                                clearable
                                fluid
                                options={continents}
                                selection placeholder='Wybierz kontynent...'
                                onChange={this.handleSelect}
                                value={this.state.selectedContinent}
                            />
                        </Grid.Column>
                        <Grid.Column as={Form} width={6} textAlign={"right"}
                                     style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
                            <span style={{
                                display: 'inline-flex',
                                padding: '0 8px',
                                height: '100%'
                            }}>Cena za dobę: {this.state.rangeValue || '0' }</span>
                            <input type={'range'}
                                   min={0}
                                   max={2000}
                                   step={100}
                                   onChange={this.handleRange}
                                   name={'show'}
                                   value={this.state.rangeValue}
                                   style={{minHeight: '40px'}}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid container
                      style={
                          {flex: 1, justifyContent: 'center', flexDirection: 'column', margin: 'auto !important'}
                      }>
                    <Grid.Row
                        columns={3} style={{flex: 1}}
                    >
                        {this.queryOutput()}
                    </Grid.Row>
                </Grid>
                <Modal dimmer={"blurring"} open={this.state.selectedTrip != null}
                    // onClose={close}
                >
                    {selectedTrip != null && <Fragment>
                        <Modal.Header>{selectedTrip.title}</Modal.Header>
                        <Modal.Content image>
                            <Image
                                wrapped
                                size="large"
                                src={selectedTrip.img}
                            />
                            <Modal.Description>
                                <Header>{selectedTrip.city}</Header>
                                <ul style={{padding: "0 0 0 1.5rem"}}>
                                    <li>{selectedTrip.continent}</li>
                                    <li>Cena za dobę za osobę: {selectedTrip.price} PLN</li>
                                    <li>Data wyjazdu: {selectedTrip.date}</li>
                                    <li>Opis: {selectedTrip.description}</li>
                                </ul>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black"
                                    onClick={() => {
                                        this.setState({
                                            selectedTrip: null
                                        })
                                    }}
                            >
                                Wyjdź
                            </Button>
                            <Button
                                positive
                                // icon={`heart ${favourites.includes(trip.id) ? "" : "outline"}`}
                                labelPosition="right"
                                // content={`${favourites.includes(trip.id) ? "Ulubione" : "Dodaj do ulubionych"}`}
                                onClick={() => {
                                    // if(favourites.includes(trip.id)){
                                    //     setFavourites(favourites.filter(id => id !== trip.id))
                                    // } else {
                                    //     setFavourites([...favourites, trip.id]);
                                    // };
                                }}
                            />
                        </Modal.Actions>
                    </Fragment>}
                </Modal>
            </div>
        );
    };
}

export default Search;

