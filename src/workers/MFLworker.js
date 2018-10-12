
import { dhis2query } from "./worker.js"


compareWithDHIS2(results) {
    results.map(facility => {
        dhis2query("organisationUnits.json?filter=level:eq:5&filter=displayName:ilike:" + facility.name + "&filter=code:eq:" + facility.code).then(resp => {
            if (resp.pager.total !== 1) {
                dhis2query("organisationUnits.json?filter=level:eq:5&filter=code:eq:" + facility.code).then(resp => {
                    if (resp.pager.total !== 1) {
                        dhis2query("organisationUnits.json?filter=level:eq:5&filter=displayName:ilike:" + facility.name).then(resp => {
                            if (resp.pager.total !== 1) {
                                resolutions.concat({
                                    mfl: facility,
                                    dhis: resp.organisationUnits[0]
                                })
                            } else {
                                console.log("Found by name")
                                resolutions.concat({
                                    mfl: facility,
                                    dhis: resp.organisationUnits[0]
                                })
                            }
                        })
                    } else {
                        console.log("Found by CODE")
                        resolutions.concat({
                            mfl: facility,
                            dhis: resp.organisationUnits[0]
                        })
                    }

                })
            } else {
                console.log("Found by CODE and NAME")
                resolutions.concat({
                    mfl: facility,
                    dhis: resp.organisationUnits[0]
                })
            }

        })
    })
}