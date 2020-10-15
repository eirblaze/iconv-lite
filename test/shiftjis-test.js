"use strict";

const assert = require("assert"),
    utils = require("./utils"),
    iconv = utils.requireIconv();

describe("ShiftJIS tests #node-web", function () {
    it("ShiftJIS correctly encoded/decoded", function () {
        const testString = "中文abc", //unicode contains ShiftJIS-code and ascii
            testStringBig5Buffer = utils.bytes("92 86 95 b6 61 62 63"),
            testString2 = "測試",
            testStringBig5Buffer2 = utils.bytes("91 aa 8e 8e");

        assert.strictEqual(
            utils.hex(iconv.encode(testString, "shiftjis")),
            utils.hex(testStringBig5Buffer)
        );
        assert.strictEqual(iconv.decode(testStringBig5Buffer, "shiftjis"), testString);
        assert.strictEqual(
            utils.hex(iconv.encode(testString2, "shiftjis")),
            utils.hex(testStringBig5Buffer2)
        );
        assert.strictEqual(iconv.decode(testStringBig5Buffer2, "shiftjis"), testString2);
    });

    it("ShiftJIS extended chars are decoded, but not encoded", function () {
        const buf = utils.bytes("ed 40 ee fc ee ef"),
            str = "纊＂ⅰ",
            res = "fa 5c fa 57 fa 40", // repeated block (these same chars are repeated in the different place)
            buf2 = utils.bytes("f0 40 f2 fc f9 40"),
            str2 = "",
            res2 = "3f 3f 3f"; // non-repeated, UA block.

        assert.strictEqual(iconv.decode(buf, "shiftjis"), str);
        assert.strictEqual(iconv.decode(buf2, "shiftjis"), str2);

        assert.strictEqual(utils.hex(iconv.encode(str, "shiftjis")), res);
        assert.strictEqual(utils.hex(iconv.encode(str2, "shiftjis")), res2);
    });

    it("ShiftJIS includes extensions", function () {
        assert.strictEqual(iconv.decode(utils.bytes("87 40"), "shiftjis"), "①");
        assert.strictEqual(utils.hex(iconv.encode("①", "shiftjis")), "87 40");
    });

    it("ShiftJIS correctly character reference encoded/decoded", function () {
        const testString = "日本abcｱｲｳ🎈", //unicode contains ShiftJIS-code and ascii
            testStringBig5Buffer = utils.bytes("93 fa 96 7b 61 62 63 b1 b2 b3 3f "),
            testStringBig5BufferHtml = utils.bytes(
                "93 fa 96 7b 61 62 63 b1 b2 b3 26 23 78 31 66 33 38 38 3b"
            ),
            testStringBig5BufferCss = utils.bytes(
                "93 fa 96 7b 61 62 63 b1 b2 b3 5c 31 66 33 38 38"
            ),
            testString2 = "試ｽ〜～🍙‖∥−－¢￠£￡¬￢",
            testStringBig5Buffer2 = utils.bytes(
                "8e 8e bd 3f 81 60 3f 3f 81 61 3f 81 7c 3f 81 91 3f 81 92 3f 81 ca"
            ),
            testStringBig5Buffer2Html = utils.bytes(
                "8e 8e bd 26 23 78 33 30 31 63 3b 81 60 26 23 78 31 66 33 35 39 3b 26 23 78 32 30 31 36 3b 81 61 26 23 78 32 32 31 32 3b 81 7c 26 23 78 61 32 3b"
            ),
            testStringBig5Buffer2Css = utils.bytes(
                "8e 8e bd 5c 33 30 31 63 81 60 5c 31 66 33 35 39 5c 32 30 31 36 81 61 5c 32 32 31 32 81 7c 5c 61 32 81 91 5c 61 33 81 92 5c 61 63 81 ca"
            );

        assert.strictEqual(
            utils.hex(iconv.encode(testString, "shiftjis", {})),
            utils.hex(testStringBig5Buffer)
        );
        assert.strictEqual(
            utils.hex(iconv.encode(testString2, "shiftjis", {})),
            utils.hex(testStringBig5Buffer2)
        );

        assert.strictEqual(
            utils.hex(iconv.encode(testString, "shiftjis", { charRefMode: "html" })),
            utils.hex(testStringBig5BufferHtml)
        );
        assert.strictEqual(
            utils.hex(iconv.encode(testString2, "shiftjis", { charRefMode: "html" })),
            utils.hex(testStringBig5Buffer2Html)
        );

        assert.strictEqual(
            utils.hex(iconv.encode(testString, "shiftjis", { charRefMode: "css" })),
            utils.hex(testStringBig5BufferCss)
        );
        assert.strictEqual(
            utils.hex(iconv.encode(testString2, "shiftjis", { charRefMode: "css" })),
            utils.hex(testStringBig5Buffer2Css)
        );
    });
});
