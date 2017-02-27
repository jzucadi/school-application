
// Write data in schools.json into our global variable. I use the word "product" as a general term to describe the main object of the app. 

var products = [
  {id: 1, name: 'Avon Elementary School', county: 'District of Columbia', students: 1973, grades: '1-5'},
  {id: 2, name: 'Britten High School', county: 'District of Columbia', students: 17, grades: '9-12'},
  {id: 3, name: 'Coolidge Middle School', county: 'District of Columbia', students: 823, grades: '6-8'},
  {id: 4, name: 'Darling Academy', county: 'Middlewood', students: 235, grades: 'K-12'},
  {id: 5, name: 'Elk Ridge School', county: 'Middlewood', students: 21436, grades: 'K-12'},
  {id: 6, name: 'Friar Tuck Magnet School', county: 'Bell', students: 25, grades: 'K-8'},
  {id: 7, name: 'Garrison Elementary School', county: 'Tift', students: 999, grades: 'K-5'},
  {id: 8, name: 'Harvard Prep', county: 'Cork', students: 100, grades: '8-12'},
  {id: 9, name: 'Ingleside Academy', county: 'Cork', students: 99, grades: '6-12'},
  {id: 10, name: 'Jefferson High School', county: 'Flatbush', students: 237, grades: '9-12'},
  {id: 11, name: 'Kilbourne Junior High', county: 'Flatbush', students: 123, grades: '6-9'},
  {id: 12, name: 'Lamont Prep', county: 'Flatbush', students: 123, grades: '9-12'},
  {id: 13, name: 'Mt Ranier Montessori', county: 'Alexandria', students: 897, grades: 'K'},
  {id: 14, name: 'North Pole Middle School', county: 'Alexandria', students: 400, grades: '6-8'},
  {id: 15, name: 'Oxbridge Elementary', county: 'Alexandria', students: 234, grades: '1-5'},
  {id: 16, name: 'Pringle Middle School', county: 'Alexandria', students: 351, grades: '6-8'},
  {id: 17, name: 'Quincy Polytech', county: 'Farmer', students: 1897, grades: '9-12'},
  {id: 18, name: 'Rodgers Mill Magnet', county: 'Farmer', students: 2000, grades: '9-12'},
  {id: 19, name: 'Salford Prep', county: 'Idlewild', students: 1, grades: '9-12'},
  {id: 20, name: 'Trunxton High', county: 'Idlewild', students: 230, grades: '9-12'}, 
];


// Each school or "product" if sifted through based on ID, and we set up our "key" which we use later for searching and sorting. 
// We don't display the school ID, it's purely to allow us to easily move around the full list and find what we need.

function findProduct (productId) {
  return products[findProductKey(productId)];
};

function findProductKey (productId) {
  for (var key = 0; key < products.length; key++) {
    if (products[key].id == productId) {
      return key;
    }
  }
};

// Setting up the ability for the school data to be displayed.
// Global variable of "List" is set and linked to appropriate template.
// Added method that sets variable for the column to allow for sorting.
// The computed property uses information from above function to actually allow the sorting.
// Computed property also uses above function on our school data to allow for searching for items by school name.

var List = Vue.extend({
  template: '#product-list',
  data: function () {
    return {products: products, searchKey: '', sortBy: '', direction: 'asc'};
  },
  computed: {
    filteredProducts: function () {
      return this.products.filter((product) => {
        return this.searchKey=='' || product.name.indexOf(this.searchKey) !== -1;
      }).sort((a, b) => {
        if (this.direction == 'asc') {
          return (a[this.sortBy] < b[this.sortBy]) ? -1 : 1;
        }
        else {
          return (b[this.sortBy] < a[this.sortBy] ? -1 : 1);
        }
      });
    },
  },
  methods: {
    sortByColumn: function(columnName) {
      if (this.sortBy == columnName) {
        this.direction = (this.direction == 'asc') ? 'desc' : 'asc';
      }
      else {
        this.sortBy = columnName;
        this.direction = 'asc';
      }
      
      console.log('sorty by', this.sortBy, this.direction)
    }
  }
});


// This variable calls template for displaying product page, and the information displayed is set by our parameters.
// Product page is when you click on the School name and it displays just that school's information.

var Product = Vue.extend({
  template: '#product',
  data: function () {
    return {product: findProduct(this.$route.params.product_id)};
  }
});

// This variable is set up to allow for the user to edit school entries.
// Template for editing is called and we add a method to make sure all of our parameters are met before saving.

var ProductEdit = Vue.extend({
  template: '#product-edit',
  data: function () {
    return {product: findProduct(this.$route.params.product_id)};
  },
  methods: {
    updateProduct: function () {
      var product = this.product;
      products[findProductKey(product.id)] = {
        id: product.id,
        name: product.name,
        county: product.county,
        students: product.students,
        grades: product.grades
      };
      router.push('/');
    }
  }
});


// Setting variable for the abiltiy to delete school entries.
// Variable calls template which confirms that you want to make deletion and update is saved to main list of schools.

var ProductDelete = Vue.extend({
  template: '#product-delete',
  data: function () {
    return {product: findProduct(this.$route.params.product_id)};
  },
  methods: {
    deleteProduct: function () {
      products.splice(findProductKey(this.$route.params.product_id), 1);
      router.push('/');
    }
  }
});


// Setting variable for the ability to add a new school entry. 
// Variable calls template and we set our parameters that each school entry requires. 
// We set a method which takes the school information and saves the new entry to our complete list.

var AddProduct = Vue.extend({
  template: '#add-product',
  data: function () {
    return {product: {name: '', county: '', students: '', grades: '',}}
  },
  methods: {
    createProduct: function() {
      var product = this.product;
      products.push({
        id: Math.random().toString().split('.')[1],
        name: product.name,
        county: product.county,
        students: product.students,
        grades: product.grades
      });
      router.push('/');
    }
  }
});


// This global variable is for our router. 
// This makes sure that our app knows which template to associate which each variable and function above.
// Our single page application is defined in the DOM with an ID of "app". 

var router = new VueRouter({routes:[
  { path: '/', component: List},
  { path: '/product/:product_id', component: Product, name: 'product'},
  { path: '/add-product', component: AddProduct},
  { path: '/product/:product_id/edit', component: ProductEdit, name: 'product-edit'},
  { path: '/product/:product_id/delete', component: ProductDelete, name: 'product-delete'}
]});
app = new Vue({
  router:router
}).$mount('#app')