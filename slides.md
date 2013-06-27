## A comprehensive look at representing physical quantities in Python

![](img/scipy.png)

Trevor Bekolay <br>
University of Waterloo <br>
[bekolay.org/scipy2013-quantities](http://bekolay.org/scipy2013-quantities)

<aside class="notes" data-markdown>
* Hi, I'm Trevor Bekolay
* You can follow along with this talk at this URL
* I want to talk to you about quantities
* Introduced in python-neo
  * It was good
  * Why aren't they more common?
</aside>



# 35.0 m/s

<h1 class="fragment">78.2928 mph</h1>

<aside class="notes" data-markdown>
* What is a physical quantity?
  * Magnitude + units = quantity
* These two quantities are the same
  * How can you treat them the same in your code?
</aside>



<img src="img/mars_orbiter.png" width="80%">

[<span data-icon="&#xe003;"></span> tbekolay/pyconca2012](https://github.com/tbekolay/pyconca2012)

<aside class="notes" data-markdown>
* Famous Mars Climate Orbiter example
  * Crashed into the surface of Mars
    because of force units (pounds vs Newtons)
* Tracking units is important!
</aside>



## Packages

<div class="two-col">
<ul>
<li>[`astropy.units`](https://astropy.readthedocs.org/en/latest/units/index.html)</li>
<li>[`buckingham`](https://code.google.com/p/buckingham/)</li>
<li>[`dimensions.py`](http://code.activestate.com/recipes/577333-numerical-type-with-units-dimensionspy/)</li>
<li>[`dimpy`](http://www.inference.phy.cam.ac.uk/db410/)</li>
<li>[`firkin`]()</li>
<li>[`ipython-physics`](https://bitbucket.org/birkenfeld/ipython-physics)</li>
<li>[`magnitude`](http://juanreyero.com/open/magnitude/index.html)</li>
<li>[`numericalunits`](https://github.com/sbyrnes321/numericalunits)</li>
<li>[`pint`](https://pint.readthedocs.org/en/latest/)</li>
</ul><ul>
<li>[`piquant`](http://sourceforge.net/p/piquant/code/HEAD/tree/trunk/)</li>
<li>[`python-units`]()</li>
<li>[`quantities`](http://pythonhosted.org/quantities/)</li>
<li>[`scimath`](http://docs.enthought.com/scimath/)</li>
<li>[`simtk.units`](https://simtk.org/home/python_units)</li>
<li>[`SP.PhysicalQuantities`](https://bitbucket.org/khinsen/scientificpython)</li>
<li>[`udunitspy`]()</li>
<li>[`units`](https://github.com/doublereedkurt/python-units)</li>
<li>[`unum`](http://home.scarlet.be/be052320/Unum.html)</li>
</ul>
</div>

<aside class="notes" data-markdown>
* There are lots of packages out there
* Most common feedback I received:
  "Did you get x package?"
</aside>



## Packages

<div class="two-col">
<ul>
<li>[`astropy.units`](https://astropy.readthedocs.org/en/latest/units/index.html)</li>
<li>[`dimensions.py`](http://code.activestate.com/recipes/577333-numerical-type-with-units-dimensionspy/)</li>
<li>[`dimpy`](http://www.inference.phy.cam.ac.uk/db410/)</li>
<li>[`ipython-physics`](https://bitbucket.org/birkenfeld/ipython-physics)</li>
<li>[`magnitude`](http://juanreyero.com/open/magnitude/index.html)</li>
<li>[`numericalunits`](https://github.com/sbyrnes321/numericalunits)</li>
<li>[`pint`](https://pint.readthedocs.org/en/latest/)</li>
<li>[`piquant`](http://sourceforge.net/p/piquant/code/HEAD/tree/trunk/)</li>
<li>[`quantities`](http://pythonhosted.org/quantities/)</li>
</ul><ul>
<li>[`scimath`](http://docs.enthought.com/scimath/)</li>
<li>[`SP.PhysicalQuantities`](https://bitbucket.org/khinsen/scientificpython)</li>
<li>[`unum`](http://home.scarlet.be/be052320/Unum.html)</li>
<li><del>`buckingham`</del></li>
<li><del>`firkin`</del></li>
<li><del>`python-units`</del></li>
<li><del>`simtk.units`</del></li>
<li><del>`udunitspy`</del></li>
<li><del>`units`</del></li>
</ul>
</div>

<aside class="notes" data-markdown>
* I couldn't get all of them working
  * But we still have 12
* Why 12?
  * Different use cases?
</aside>



## Why?!

* Making a quantities package is easy
* Making a good quantities package is hard



## Implementation

Container
```python
class Quantity(object):
    def __init__(self, magnitude, unit):
        ...
```
Subclass
```python
class Quantity(numpy.ndarray):
    def __new__(cls, ...):
        ...
```
<aside class="notes" data-markdown>
* To clarify about implementation,
  this is what I mean
* If you want pure speed and dimensional analysis
  check out numericalunits
  * Or check it out anyway, it's neat
</aside>



## Wrapping functions

```python
from scipy.optimize import fsolve

CA0 = 1 * u.mol / u.L
CA = 0.01 * u.mol / u.L
k = 1.0 / u.s

def func(t):
    return CA - CA0 * np.exp(-k * t)

tguess = 4 * u.s
print fsolve(func, tguess)
```


```python
from scipy.optimize import fsolve as _fsolve

def fsolve(func, t0):
    # units on initial guess, normalized
    tU = t0 / float(t0)
    def wrapped_func(t):
        return float(func(t * tU))

    sol, = _fsolve(wrapped_func, t0)
    return sol * tU
```

<small>Thanks John! ([jkitchin.github.io/blog](http://jkitchin.github.io/blog/2013/03/22/Handling-units-with-the-quantities-module/))</small>



<img src="img/standards.png" width="100%" class="border">
<figcaption>[xkcd](http://xkcd.com/927/) on standards</figcaption>

<aside class="notes" data-markdown>
* There are lots of use cases
  * This comic is maybe why there are so many packages
* Let's avoid making our own for now
</aside>



<div id="facts"></div>

<aside class="notes" data-markdown>
* First, let's get to know these libraries
* Take some of these things with a grain of salt,
  but sometimes good to know
</aside>



## What should I use?

[<span data-icon="&#xe003;"></span> tbekolay/quantities-comparison](https://github.com/tbekolay/quantities-comparison)

<aside class="notes" data-markdown>
* What should I use, given my use case
  * I've quantified/codified this in
    this repository (and this talk)
* Please add your own use cases
* Maybe there will always be a best choice
  (fingers crossed)
</aside>



## My use case

* Time-series data
* Not mixing units often
* Transparent, except errors

<aside class="notes" data-markdown>
* My needs are pretty minimal
* I mainly am manipulating time-series data
* I just want to be able to write code
  such that it works whether my time-scale
  is seconds, milliseconds, whatever
</aside>



## My criteria

1. NumPy compatibility
2. Simple syntax
3. Low overhead

<aside class="notes" data-markdown>
* So, these are my criteria
  * We'll go into more detail soon
</aside>



# Syntax


## Creating a quantity

1. Multiply magnitude by unit <span data-icon="&#xe007;" class="fragment"></span>
```python
length = 5.0 * q.meter
```
2. Quantity constructor with unit argument (string or unit)
```python
length = q.Quantity(5.0, units='meter')
length = q.Quantity(5.0, units=q.meter)
```


<div id="syntax" class="table-container"></div>



# Compatibility


## NumPy magnitudes

```python
length = np.ones((3, 3)) * q.meter

length = q.Quantity(np.ones((3, 3)),
                    units='meter')
length = q.Quantity(np.ones((3, 3)),
                    units=q.units.meter)
```


<div id="compatibility-syntax" class="table-container"></div>


## Python operators

* Unary (e.g., `-length`)
* Binary (e.g., `length * other_length`)
  * `length` and `other_length` have same units
  * `length` and `other_length` have compatible units
  * `length` and `other_length` have different units


<div id="compatibility-unary_ops" class="table-container"></div>


<div id="compatibility-binary_same_ops" class="table-container"></div>
Binary operators, same units


<div id="compatibility-binary_compatible_ops" class="table-container"></div>
Binary operators, compatible units


<div id="compatibility-binary_different_ops" class="table-container"></div>
Binary operators, different units


## NumPy ufuncs

* Unary (e.g., `numpy.ceil(length)`)
* Binary (e.g., `numpy.maximum(length, other_length`)
  * Same, compatible, different


<div id="compatibility-unary_ufuncs" class="table-container"></div>


<div id="compatibility-binary_same_ufuncs" class="table-container"></div>
Binary ufuncs, same units


<div id="compatibility-binary_compatible_ufuncs" class="table-container"></div>
Binary ufuncs, compatible units


<div id="compatibility-binary_different_ufuncs" class="table-container"></div>
Binary ufuncs, different units


## Other NumPy functions


<div id="compatibility-other_numpy" class="table-container"></div>



# Speed


<div id="speed"><svg></svg></div>



## What should I use now?

* For me, `quantities`

[<span data-icon="&#xe003;"></span> tbekolay/quantities-comparison](https://github.com/tbekolay/quantities-comparison)



## Ideas

1. Funnel development to one package
  * Should be easy to wrap a function
2. Make a fully wrapped version of NumPy
  * `import numpy_quantities as np`
3. Implement units support in NumPy

----

[bekolay.org/scipy2013-quantities](http://bekolay.org/scipy2013-quantities) • [tbekolay@gmail.com](mailto:tbekolay@gmail.com)

<aside class="notes" data-markdown>
* So what should you use?
  * For my use case, quantities works
    * Plus I have to use it
    * But I'm more convinced now that it's a good idea
</aside>
