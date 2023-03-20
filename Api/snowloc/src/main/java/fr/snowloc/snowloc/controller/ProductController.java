package fr.snowloc.snowloc.controller;

import fr.snowloc.snowloc.model.Product;
import fr.snowloc.snowloc.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
public class ProductController {

    @Autowired
    ProductRepo productRepo;

    @GetMapping("/productList")
    public List<Product> getProductList(){
        return  productRepo.findAll();
    }

    @GetMapping("/product")
    public Optional<Product> getProductById(@RequestParam Long productId){
        return productRepo.findById(productId);
    }

    @PostMapping("/product")
    public Product insertProduct(@RequestBody Product product){
        return productRepo.save(product);
    }

    @DeleteMapping("/product")
    public void deleteProductById(@RequestParam Long productId){
        productRepo.deleteById(productId);
    }

}
