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
        this.setState({searchKey: searchKey});
        this.props.searchHandler(searchKey);
    },
    render: function () {
        return (
            <div className="bar bar-standard bar-header-secondary">
                <input type="search" value={this.state.symbol} onChange={this.searchHandler} ref="searchInput"/>
            </div>

        );
    }
});

var StudentListItem = React.createClass({
    render: function () {
        var student = this.props.student;
        if(!student || !student.id){
            return (
                    <li className="table-view-cell media">
                        No match found. Please provide a valid student Id.
                    </li>
                );

        }
        var img = "";
        if(student.picture){
            img = "data:image/png;base64," + student.picture;
        }else{
            img = "https://placeholdit.imgix.net/~text?txtsize=33&txt=Pic&w=140&h=140";
        }

        //img = student.picture ?"data:image/png;base64," :  "https://placeholdit.imgix.net/~text?txtsize=33&txt=Pic&w=140&h=140";
        
        return (
            <li className="table-view-cell media">
                <a href={"#student/" + student.id}>
                    <img className="media-object small pull-left" src={img} />
                    {student.studentsName}
                    <p>{student.StudentsGrade}</p>
                </a>
            </li>
        );
    }
});

var StudentList = React.createClass({
    getInitialState: function() {
        return {student: {}};
    },
    render: function () {
        var student = this.props.student;
        if(!student || !student.id){
            student = {'id':null};
        }
        return (
            <ul  className="table-view">
                <StudentListItem key={student.id} student={student} />
            </ul>
        );
    }
});

var HomePage = React.createClass({
    render: function () {
        return (
            <div className={"page " + this.props.position}>
                <Header text="Student Directory" back="false"/>
                <SearchBar searchKey={this.props.searchKey} searchHandler={this.props.searchHandler}/>
                <div className="content">
                    <StudentList student={this.props.student}/>
                </div>
            </div>
        );
    }
});

var StudentPage = React.createClass({
    getInitialState: function() {
        return {student: {}};
    },
    componentDidMount: function() {
        this.props.service.findById(this.props.studentId).done(function(result) {
            this.setState({student: result});
        }.bind(this));
    },
    render: function () {
        var img = "";
        var fatherPrimary = ""
        var motherPrimary = ">> "
        if(this.state.student.picture){
            img = "data:image/png;base64," + this.state.student.picture;
        }else{
            img = "https://placeholdit.imgix.net/~text?txtsize=33&txt=Pic&w=140&h=140";
        }

        if(this.state.student.primaryContact == "Father"){
            fatherPrimary = ">> ";
            motherPrimary = "";
        }

        return (
            <div className={"page " + this.props.position}>
                <Header text="Student" back="true"/>
                <div className="card">
                    <ul className="table-view">
                        <li className="table-view-cell media">
                            <img className="media-object small pull-left" src={img}/>
                            <h1>{this.state.student.studentsName}</h1>
                            <p>{this.state.student.StudentsGrade}</p>
                        </li>
                        <li className="table-view-cell media">
                            <p>Pick up name</p>
                            <h1>{this.state.student.pickupName}</h1>
                            <p>{this.state.student.pickupRelation}</p>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"tel:" + this.state.student.fathersCellNo} className="push-right">
                                <span className="media-object pull-left icon icon-call"></span>
                                <div className="media-body">
                                    <b>{fatherPrimary}</b>{this.state.student.fathersFirstName} {this.state.student.fathersLastName}
                                    <p>Tap to call Father</p>
                                    <p>{this.state.student.fathersCellNo}</p>
                                </div>
                            </a>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"tel:" + this.state.student.mothersCellNo} className="push-right">
                                <p></p>
                                <span className="media-object pull-left icon icon-call"></span>
                                <div className="media-body">
                                    <b>{motherPrimary}</b>{this.state.student.mothersFirstName} {this.state.student.mothersLastName}
                                    <p>Tap to call Mother</p>
                                    <p>{this.state.student.mothersCellNo}</p>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
});

var Directory = React.createClass({
    mixins: [PageSlider],
    getInitialState: function() {
        return {
            searchKey: '',
            student: {}
        }
    },
    searchHandler: function(searchKey) {
        if(searchKey.length < 5){
            return;
        }
        studentService.findById(searchKey).done(
                function(student){
                    console.log(student);
                    this.setState(
                            {
                                student: student,
                                searchKey:searchKey,
                                pages: [<HomePage key="list" searchHandler={this.searchHandler} searchKey={searchKey} student={student}/>]
                            }
                        );
                }.bind(this)
            );
    },
    componentDidMount: function() {
        router.addRoute('', function() {
            this.slidePage(<HomePage key="list" searchHandler={this.searchHandler} searchKey={this.state.searchKey} student={this.state.student}/>);
        }.bind(this));
        router.addRoute('student/:id', function(id) {
            this.slidePage(<StudentPage key="details" studentId={id} service={studentService}/>);
        }.bind(this));
        router.start();
    }
});

React.render(<Directory/>, document.body);