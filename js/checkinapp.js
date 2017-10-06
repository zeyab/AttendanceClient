var Header = React.createClass({
    render: function () {
        return (
            <header className="bar bar-nav">
                <a href="javascript:history.go(-1);" className={"icon icon-left-nav pull-left" + (this.props.back==="true"?"":" hidden")}></a>
                <h1 className="title">{this.props.text}</h1>
            </header>
        );
    }
});

var SearchBar = React.createClass({
    getInitialState: function() {
        return {searchKey: ""};
    },
    
    componentDidMount: function(){
        React.findDOMNode(this.refs.searchInput).focus(); 
    },

    searchHandler: function(event) {
        var searchKey = event.target.value;
        if(event.charCode == 13){
            this.setState({searchKey: searchKey});
            this.props.searchHandler(searchKey);
            event.target.select();
        }
    },

    formSubmit: function(e){
        e.preventDefault();
        return false;
    },
    
    render: function () {
        return (
            <div className="bar bar-standard bar-header-secondary">
                <form className="searchBox" onSubmit={this.formSubmit}>
                    <input type="search" value={this.state.symbol} onKeyPress={this.searchHandler} ref="searchInput"/>
                    <button type="reset">Clear</button>
                </form>
            </div>

        );
    }
});

var CheckInConfirmation = React.createClass({
    getInitialState: function() {
        return {result: {}};
    },

    render: function () {
        if(!this.props.student) this.props.student = {}
        var message = "";
        if(this.props.student && this.props.student.id){
            message = this.props.student.studentsName+ " marked present at " + this.props.stamp+".";
        }
        var img = "";
        if(!this.props.student || !this.props.student.id){
            img = "";
        }
        else if(this.props.student && this.props.student.picture){
            img = "data:image/png;base64,"+this.props.student.picture;
        }else{
            img = "https://placeholdit.imgix.net/~text?txtsize=33&txt=Pic&w=140&h=140";
        }

        return (
            <ul>
            <li className="table-view-cell media">
                <img className="media-object small pull-left" src={img} />
                {message}
            </li>
            </ul>
        );
    }
});

var HomePage = React.createClass({
    render: function () {
        return (
            <div className={"page " + this.props.position}>
                <Header text="Student Checkin" back="false"/>
                <SearchBar searchKey={this.props.searchKey} searchHandler={this.props.searchHandler}/>
                <div className="content">
                    <CheckInConfirmation stamp={this.props.stamp} student={this.props.student}/>
                </div>
            </div>
        );
    }
});



var CheckIn = React.createClass({
    mixins: [PageSlider],
    getInitialState: function() {
        return {
            searchKey: '',
            result: {}
        }
    },
    searchHandler: function(searchKey) {
        if(searchKey.length < 8){
            return;
        }
        var student = studentService.findById(searchKey)
        var attending = attendanceService.markPresent(searchKey);
        
        //This should be sequential call to ensure student exists.
        $.when(student, attending).done(
                function(s, a){
                    console.log('a:');
                    console.log(a);

                    if(!s || !s.id){
                        throw new Error('Student does not exist. Check student id.');
                    }

                    $.ajax({
                          url: "<GOOG Form>",
                          data: {"<Field Map>"},
                          type: "POST",
                          dataType: "xml",
                          statusCode: {
                              0: function (){
                                 console.log("Success - 0")
                              },
                              200: function (){
                                 console.log("Success - 200")
                              }
                          }
                      });

                    this.setState(
                                    function(prevState, currProps){
                                        var newState = {};
                                        if(s){
                                            newState.student = s;
                                        }
                                        if(a){
                                            newState.stamp = a.stamp;
                                        }

                                        newState.searchKey = searchKey,
                                        newState.pages = [<HomePage key="list" searchHandler={this.searchHandler} 
                                                searchKey={searchKey} stamp={newState.stamp} student={newState.student}/>]

                                        return newState;
                                    }.bind(this)
                                );
                }.bind(this)
            );
    },
    componentDidMount: function() {
        router.addRoute('', function() {
            this.slidePage(<HomePage key="list" searchHandler={this.searchHandler} searchKey={this.state.searchKey} result={this.state.result}/>);
        }.bind(this));
        router.start();
    }
});

React.render(<CheckIn/>, document.body);