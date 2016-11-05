import React, {Component} from 'react'

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getUrl(command, field) {
  return "https://api.nutritionix.com/v1_1/" + command + "/" + field +
  "?appId=8e3af8d4&appKey=994bb13c586ad6d440bbabd271bb2616";
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {
        hits: [],
      },
    };
    this.call = this.call.bind(this);
  }
  call() {
    httpGetAsync(getUrl("search","starbucks"), (response) => {
      console.log(response);
      this.setState({response});
      this.getTable();
    });
  }
  getTable(){
    $('#test2').nutritionLabel({
    	'showServingUnitQuantity' : false,
    	'itemName' : 'Bleu Cheese Dressing',
    	'ingredientList' : 'Bleu Cheese Dressing',

    	'showPolyFat' : false,
    	'showMonoFat' : false,

    	'valueCalories' : 450,
    	'valueFatCalories' : 430,
    	'valueTotalFat' : 48,
    	'valueSatFat' : 6,
    	'valueTransFat' : 0,
    	'valueCholesterol' : 30,
    	'valueSodium' : 780,
    	'valueTotalCarb' : 3,
    	'valueFibers' : 0,
    	'valueSugars' : 3,
    	'valueProteins' : 3,
    	'valueVitaminA' : 0,
    	'valueVitaminC' : 0,
    	'valueCalcium' : 0,
    	'valueIron' : 0
    });
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.response.hits.map((hit) => (
            <li key={hit._id}> {hit.fields.item_name} </li>
          ))}
        </ul>
        <button
          type='button'
          id='asd'
          onClick={this.call} />
        <div id="test2"></div>
      </div>
    );
  }
}
