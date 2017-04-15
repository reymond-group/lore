[![view on npm](http://img.shields.io/npm/v/example.svg)](https://www.npmjs.org/package/example)

<a name="RadixSort"></a>

## RadixSort
A class wrapping a radix sort for floats.

**Kind**: global class  

* [RadixSort](#RadixSort)
    * [new RadixSort()](#new_RadixSort_new)
    * [.sort(arr, copyArray)](#RadixSort+sort) ⇒ <code>Object</code>
    * [.lsbPass(arr, aux)](#RadixSort+lsbPass)
    * [.pass(arr, aux)](#RadixSort+pass)
    * [.msbPass(arr, aux)](#RadixSort+msbPass)
    * [.initHistograms(arr, maxOffset, lastMask)](#RadixSort+initHistograms)

<a name="new_RadixSort_new"></a>

### new RadixSort()
Creates an instance of RadixSort.

<a name="RadixSort+sort"></a>

### radixSort.sort(arr, copyArray) ⇒ <code>Object</code>
Sorts a 32-bit float array using radix sort.

**Kind**: instance method of <code>[RadixSort](#RadixSort)</code>  
**Returns**: <code>Object</code> - The result in the form { array: sortedArray, indices: sortedIndices }.  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Float32Array</code> | The array to be sorted. |
| copyArray | <code>Boolean</code> | A boolean indicating whether to perform the sorting directly on the array or copy it. |

<a name="RadixSort+lsbPass"></a>

### radixSort.lsbPass(arr, aux)
The lsb (least significant bit) pass of the algorithm.

**Kind**: instance method of <code>[RadixSort](#RadixSort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Float32Array</code> | The array. |
| aux | <code>Float32Array</code> | An auxilliary array. |

<a name="RadixSort+pass"></a>

### radixSort.pass(arr, aux)
The main pass of the algorithm.

**Kind**: instance method of <code>[RadixSort](#RadixSort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Float32Array</code> | The array. |
| aux | <code>Float32Array</code> | An auxilliary array. |

<a name="RadixSort+msbPass"></a>

### radixSort.msbPass(arr, aux)
The msb (most significant bit) pass of the algorithm.

**Kind**: instance method of <code>[RadixSort](#RadixSort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Float32Array</code> | The array. |
| aux | <code>Float32Array</code> | An auxilliary array. |

<a name="RadixSort+initHistograms"></a>

### radixSort.initHistograms(arr, maxOffset, lastMask)
Initialize the histogram used by the algorithm.

**Kind**: instance method of <code>[RadixSort](#RadixSort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Float32Array</code> | The array to be sorted. |
| maxOffset | <code>Number</code> | The maximum offset. |
| lastMask | <code>Number</code> | The last max, based on the msb (most significant bit) mask. |


* * *
