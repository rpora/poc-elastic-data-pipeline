import {inferTypeFromString} from "./index";

describe('types inferer', function () {

    it("infers string from string", () => {
        expect(inferTypeFromString("foo")).toEqual({
            type: "string",
            value: "foo"
        });
    });

    it("infers int from string", () => {
        expect(inferTypeFromString("10")).toEqual({
            type : "integer",
            value: 10
        });
    });

    it("infers floats from string", () => {
        expect(inferTypeFromString("10.10")).toEqual({
            type : "float",
            value: 10.10
        });
    });

    it("infers boolean from string", () => {

        let tRue = { value: true, type:"boolean" };
        let fAlse = { value: false, type:"boolean" };

        expect(inferTypeFromString("true")).toEqual(tRue);
        expect(inferTypeFromString("TRUE")).toEqual(tRue);
        expect(inferTypeFromString("false")).toEqual(fAlse);
        expect(inferTypeFromString("FALSE")).toEqual(fAlse);

    });

    it("infers date from string", () => {
        // TODO: handle (a lot) more formats
        const date = { value: new Date("12/05/2019"), type: "date"};
        expect(inferTypeFromString("12/05/2019")).toEqual(date);
    });
});
