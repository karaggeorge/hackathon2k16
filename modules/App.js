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

function getUrl(command, handler, field) {
  return "https://api.nutritionix.com/v1_1/" + command + handler + field +
  "appId=b91de4b1&appKey=fe45079da53ab1a790fc704dbb6f0721";
}

function setTable1 (id) {
  httpGetAsync(getUrl("item","?id=",id+"&"), (item) => {
    console.log(item);
    $('#table1').nutritionLabel({
      'showServingUnitQuantity' : false,
      'itemName' : item.brand_name + " " + item.item_name,
      'ingredientList' : item.nf_ingredient_statement,

      'showPolyFat' : false,
      'showMonoFat' : false,

      'valueCalories' : item.nf_calories,
      'valueFatCalories' : item.nf_calories_from_fat,
      'valueTotalFat' : item.nf_total_fat,
      'valueSatFat' : item.nf_saturated_fat,
      'valueTransFat' : item.nf_trans_fatty_acid,
      'valueCholesterol' : item.nf_cholesterol,
      'valueSodium' : item.nf_sodium,
      'valueTotalCarb' : item.nf_total_carbohydrate,
      'valueFibers' : item.nf_dietary_fiber,
      'valueSugars' : item.nf_sugars,
      'valueProteins' : item.nf_protein,
      'valueVitaminA' : item.nf_vitamin_a_dv,
      'valueVitaminC' : item.nf_vitamin_c_dv,
      'valueCalcium' : item.nf_calcium_dv,
      'valueIron' : item.nf_iron_dv,
    });
  })
}

function setTable2 (item) {
    $('#table2').nutritionLabel({
      'showServingUnitQuantity' : false,
      'itemName' : "Cumulative",

      'showPolyFat' : false,
      'showMonoFat' : false,
      'showVitaminA' : false,
    	'showVitaminC' : false,
    	'showCalcium' : false,
    	'showIron' : false,

      'valueCalories' : item.nf_calories,
      'valueFatCalories' : item.nf_calories_from_fat,
      'valueTotalFat' : item.nf_total_fat,
      'valueSatFat' : item.nf_saturated_fat,
      'valueTransFat' : item.nf_trans_fatty_acid,
      'valueCholesterol' : item.nf_cholesterol,
      'valueSodium' : item.nf_sodium,
      'valueTotalCarb' : item.nf_total_carbohydrate,
      'valueFibers' : item.nf_dietary_fiber,
      'valueSugars' : item.nf_sugars,
      'valueProteins' : item.nf_protein,
    });
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {
        hits: [],
      },
      hidden: false,
      cumul: {},
      selected: null,
      item: {
        nf_calories: 0,
        nf_calories_from_fat: 0,
        nf_total_fat: 0,
        nf_saturated_fat: 0,
        nf_trans_fatty_acid: 0,
        nf_cholesterol: 0,
        nf_sodium: 0,
        nf_total_carbohydrate: 0,
        nf_dietary_fiber: 0,
        nf_sugars: 0,
        nf_protein: 0,
      }
    };
    this.search = this.search.bind(this);
  }
  changeText(e) {
    this.setState({text: e.target.value});
  }
  search(e, template) {
    e.preventDefault();
    httpGetAsync(getUrl("search","/",this.state.text + "?results=0%3A30&"), (response) => {
      console.log(response);
      this.setState({response, hidden: true});
    })
  }
  select(id){
    const {cumul} = this.state;
    const a = this.state.item;
    if(!cumul[id]) {
      httpGetAsync(getUrl("item","?id=",id+"&"), (item) => {
        Object.keys(a).forEach((key) => {
          a[key] += item[key];
        });
      });
    }
    else {
      httpGetAsync(getUrl("item","?id=",id+"&"), (item) => {
        Object.keys(a).forEach((key) => {
          a[key] -= item[key];
        });
      });
    }
    cumul[id] = !cumul[id];
    this.setState({cumul, item: a});
    setTable2(a);
  }
  open(id) {
    this.setState({selected: id});
    setTable1(id);

  }
  custom(text) {
    httpGetAsync(getUrl("search","/",text + "?results=0%3A30&"), (response) => {
      console.log(response);
      this.setState({response, hidden: true});
    })
  }
  calculate(e) {
    e.preventDefault();
    const weight = $('#weight').val();
    const dweight = $('#dweight').val();
    const goal = $('#goal').val();
    const prot = dweight;
    const fats = dweight/2;
    const carbs = dweight * goal;
    const calories = prot * 4 + fats * 9 + carbs * 4;
    $('#cal').html(calories);
    $('#prot').html(prot);
    $('#fat').html(fats);
    $('#carb').html(carbs);
  }
  render() {
    return (
      <div>
      <div className="row">
        <div className="col-xs-3" style={{'margin-right': '70px'}}>
          <img src="https://lh3.googleusercontent.com/-7BGMsEz8muc/WB4so8v7PKI/AAAAAAAAAP4/xDo2etDAgEwN44unRDR_WtphZLBbQkSFwCL0B/h500/2016-11-05.png" alt="logo" className="img-rounded logo"/>
        </div>
        <div className="col-xs-4 input-col">
          <form className="form-horizontal" onSubmit={this.calculate}>
            <div className="form-group">
              <label htmlFor="weight" className="col-sm-2 control-label">Weight: </label>
              <div className="col-sm-10">
                <input type="number" className="form-control" id="weight" placeholder="lbs"/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="dweight" className="col-sm-2 control-label">Desired Weight: </label>
              <div className="col-sm-10">
                <input type="number" className="form-control" id="dweight" placeholder="lbs"/>
              </div>
            </div>
            <div className='form-group' style={{display: "inline-block"}}>
              <label htmlFor="goal" className="col-sm-2 control-label">Goal: </label>
              <select id='goal' style={{'margin-left': "5px", 'margin-right': '35px'}}>
                <option value='1'> Lose Fat </option>
                <option value='2'> Maintain Weight </option>
                <option value='3'> Muscle Gain </option>
              </select>
              <button className='btn btn-mine' type="submit"> Calculate </button>
            </div>
          </form>
        </div>
        <div className="col-xs-3 result-col">
          <label> Calories per day: <strong id='cal'> 0 </strong> </label>
          <div className='analytics'>
            <label> Protein: <strong id='prot'> 0 </strong> grams </label>
            <br/>
            <label> Fats: <strong id='fat'> 0 </strong> grams </label>
            <br/>
            <label> Carbs: <strong id='carb'> 0 </strong> grams </label>
          </div>
        </div>
      </div>
      <div className='content'>
        <h3> Please enter a Restaurant name to continue </h3>
        <form onSubmit={this.search}>
          <input type='text' className='rest form-control' onChange={this.changeText.bind(this)}/>
          <button className='btn btn-primary' type='submit'> Search </button>
        </form>
        <div hidden={this.state.hidden}>
          <img src="http://drpma142ptgxf.cloudfront.net/assets/logo.svg" alt="chipotle" className="img-rounded" onClick={this.custom.bind(this,"chipotle")}/>
          <img src="https://static.apkupdate.com/images/cover/com.Dominos.png" alt="dominos" className="img-rounded" onClick={this.custom.bind(this,"dominos")}/>
          <img src="http://lubbockonline.com/sites/default/files/imagecache/superphoto/DunkinDonuts_Cup_Logo.jpg" alt="dd" className="img-rounded" onClick={this.custom.bind(this,"dunkin donuts")}/>
        </div>
        <div className='row row1'>
          <div className='col-xs-8'>
            <ul className="list-group">
              {this.state.response && this.state.response.hits.map((hit) => {
                return (
                  <li
                    key={hit.fields.item_id}
                    className={'list-group-item' + (hit._id == this.state.selected ? ' active': '')}
                    onClick={this.open.bind(this,hit.fields.item_id)} >
                    <input type="checkbox" onClick={this.select.bind(this, hit.fields.item_id)}/>
                    {hit.fields.item_name}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className='col-xs-4'>
            <div id='table1'> </div>
            <div id='table2'> </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
