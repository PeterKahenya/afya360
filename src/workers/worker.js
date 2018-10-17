import $ from "jquery";

var mfl_token_url = "http://api.kmhfltest.health.go.ke/o/token/";
var mfl_url = "http://api.kmhfltest.health.go.ke/api/";
var mfl_username = "test@mail.com";
var mfl_password = "test@1234";
var mfl_client_id = "a3UXT427j160XpW1CcmMWqq7FLdkgTfH2NZlDHzV";
var mfl_client_secret =
  "Lf3lZv9XYG2p3S7nsy2sy580mDuB9ajDY6M39FIfEEzhNLua1LBY1LB1EV0NdQFClsqSvUnvpkDi8V7XTiVEXIzLtzH3MCMcO3SQblzbqlhpy97d2TamfSDsNoa6HVrJ";

var dhis2_url = "https://test.hiskenya.org/kenya/api/";
var dhis2username = "gray";
var dhis2password = "Ourgroup1.";

async function getToken() {
  var settings = {
    async: true,
    crossDomain: true,
    url: mfl_token_url,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache"
    },
    data: {
      username: mfl_username,
      password: mfl_password,
      grant_type: "password",
      client_id: mfl_client_id,
      client_secret: mfl_client_secret
    }
  };

  var y = await $.ajax(settings).done(function (response) {
    return response;
  });
  return y;
}
export async function mflquery(query) {
  var res = await getToken().then(async function my(token) {
    var settings = {
      async: true,
      crossDomain: true,
      url: mfl_url + query,
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.access_token,
        "Cache-Control": "no-cache"
      }
    };

    var res = await $.ajax(settings).done(function (response) {
      return response.results;
    });
    return res;
  });
  return res;
}
export async function dhis2query(query) {
  var settings = {
    async: true,
    crossDomain: true,
    url: dhis2_url + query,
    method: "GET",
    headers: {
      Authorization: `Basic ${btoa(dhis2username + ":" + dhis2password)}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  return $.ajax(settings).done(function (response) {
    console.log(response)
    return response;
  });
}

export async function dhis2_add_facility(payl) {
  var payload = JSON.stringify(payl);
  console.log(payload)
  var settings = {
    async: true,
    crossDomain: true,
    url: dhis2_url + "organisationUnits/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(dhis2username + ":" + dhis2password)}`
    },
    processData: false,
    data: payload
  };
  return await $.ajax(settings).done(function (response) {
    console.log(response)
    return response;
  });
}

if (!localStorage.getItem("mfl_county_names_and_id")) {
  mflquery("common/counties/?format=json&fields=name,id&page_size=47").then(
    response => {
      localStorage.setItem(
        "mfl_county_names_and_id",
        JSON.stringify(response.results)
      );
    }
  );
} else {
  console.log("local mfl counties cache found");
}

if (localStorage.getItem("dhis2_county_names_and_id") === "undefined") {
  console.log("fetching dhis2 county information");
  dhis2query("organisationUnits.json?filter=level:eq:2").then(response => {
    localStorage.setItem(
      "dhis2_county_names_and_id",
      JSON.stringify(response.organisationUnits)
    );
  });
} else {
  console.log("local dhis2 counties cache found");
}

export async function updatedhis2(orgid, payload) {
  var payl = JSON.stringify(payload);
  console.log(payl);
  var settings = {
    async: true,
    crossDomain: true,
    url: dhis2_url + "organisationUnits/" + orgid,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(dhis2username + ":" + dhis2password)}`
    },
    processData: false,
    data: payl
  };
  console.log(settings);
  return await $.ajax(settings).done(function (response) {
    console.log(response);

    return response;
  });
}

export async function dropOrg(orgid) {

  var settings = {
    async: true,
    crossDomain: true,
    url: dhis2_url + orgid + ".json",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(dhis2username + ":" + dhis2password)}`
    },
    processData: false,

  };
  return await $.ajax(settings).done(function (response) {
    console.log(response);
    return response;
  });

}

export async function lock(orgid) {
  var settings = {
    async: true,
    crossDomain: true,
    url: dhis2_url + orgid + "/users/" + ".json",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(dhis2username + ":" + dhis2password)}`
    },
    processData: false,

  };
  return await $.ajax(settings).done(function (response) {
    console.log(response);
    return response;
  });
}

